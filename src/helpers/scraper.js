
const { chromium } = require('playwright');

const empresas = {1: 'LIBERTY', 2: 'LIBERTY', 3 : 'SINEXIA'}
const sleep = time => new Promise(resolve => {setTimeout(resolve, time)});

const _listaExp = {
    LIBERTY : async function ( browser, page, dato, user, pass){
        // logueo completo
        login_liberty(browser, page, dato, user, pass);
    
        await sleep(2000);  //demora de 2000ms
        let url = await page.url();
        if( url != dato.link_exps){
            await browser.close();      //cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }

        // mapeo la lista de expedientes nuevos
        let mapeo = dato.mapeo_lista;
        let array_mapeo = mapeo.split('||');
        let wait = array_mapeo[0];
        let map = array_mapeo[1];
    
        try{
            await page.waitForSelector(wait);
            const lista = await page.$$eval(map, (spans) => spans.map((span) => span.textContent));

            if( lista.length == 0 ){
                await browser.close();      //cierro navegador
                return { status: 200,  message: "No hay expedientes nuevos", data: [] }
            }

            await browser.close();      //cierro navegador
            return { status: 200, message: "La consulta ha sido exitosa", data: lista  }

        }catch (error) {
            await browser.close();      //cierro navegador
            if (error instanceof playwright.errors.TimeoutError) {
                return { status: 400, message: "Error: ocurrio un error al intentar mapear la lista de expedientes", data: []  }
            }
        }
    },

    SINEXIA: async function ( browser, page, dato, user, pass){
        const response = await login_sinexia( browser, page, dato, user, pass)
        if(response.status != 200){return await browser.close()}

        frameObject = page.frame({ name: 'fraPrincipal' });

        await frameObject.locator('img[title="Expedientes Nuevos"]').click();
        await sleep(3000);

        frameObject = page.frame({ name: 'fraPrincipal' });

        const lista = await frameObject.$$eval('#gridbox > div.objbox > table > tbody > tr.ev_modern > td:nth-child(1)', (spans) => spans.map((span) => span.textContent));
        const lista_fecha = await frameObject.$$eval('#gridbox > div.objbox > table > tbody > tr.ev_modern > td:nth-child(10)', (spans) => spans.map((span) => span.textContent));

        let resultados = lista.map((item, index) => {return {numero_siniestro: item, fecha_encargo: lista_fecha[index] }})

        if( resultados.length == 0 ){
            await browser.close();
            return { status: 200,  message: "No hay expedientes nuevos", data: [] }
        }

        await browser.close();
        return { status: 200, message: "La consulta ha sido exitosa", data: resultados  }
    }
}

async function buscarExpediente(browser, page, exp, fecha_encargo){
    return (async () => {
        try{
            frameObject = page.frame({ name: 'fraMenus' });

            await frameObject.locator('#imagen2 > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > img').click()
            await sleep(2000);

            await frameObject.locator('#imagen2 > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td.standartTreeRow > span > a').click()
            await sleep(4000);

            frameObject = page.frame({ name: 'fraPrincipal' });
            await frameObject.locator('#tabs10 > ul > input').focus();
            await frameObject.type('#tabs10 > ul > input', exp);

            page.keyboard.press('Enter'); 
            
            try{ 
                await frameObject.locator('#maestro > table:nth-child(1) > tbody > tr > td').focus();
            }catch{
                return { status: 500, data: [], message : `No se encontró el expediente con el código: ${exp}`};
            } 

            await sleep(1500);
            let lista = await frameObject.$$eval('#maestro > table.tabla > tbody > tr > td:nth-child(5)', (spans) => spans.map((span) => span.textContent));
            lista.shift();

            let index_lista = lista.indexOf(fecha_encargo);
            if(`${index_lista}` == '-1') return { status: 500, data: [], message : `La fecha de encargo es incorrecta. Estas son las fechas existentes: ${lista.join(', ')}`};
            
            await frameObject.locator(`#det${index_lista} > td:nth-child(2) > a`).click();

            return { status: 200, data: [], message: ''};
        }catch(error){await browser.close()}
    })();
}

// loguea y lista nuevos espedientes
async function listaExp( dato, user, pass ){
    return (async () => {
        // inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        return _listaExp[empresas[dato.uid]](browser, page, dato, user, pass);
    })();
}

//loguea y mapea data de un expediente para formar una XML
async function XMLexp( dato, user, pass, exp, fecha_encargo ){
    return (async () => {
        // Inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        try{
            //login
            const response = await login_sinexia( browser, page, dato, user, pass)
            if(response.status != 200){return await browser.close()}

            //Buscar expediente
            let busqueda = await buscarExpediente(browser, page, exp, fecha_encargo);
            if(busqueda.status != 200) {await browser.close(); return busqueda}
            
            frameObject = page.frame({ name: 'fraPrincipal' });

            let data = {
                exp,
                poliza: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(6) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a').textContent(),
                fecha_encargo: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(6) > table > tbody > tr:nth-child(2) > td:nth-child(4)').textContent(),
                nombre: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(8) > table > tbody > tr:nth-child(1) > td.valorCampo').textContent(),
                obsevaciones: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(13) > table > tbody > tr > td').textContent(),
                compania: await frameObject.locator('#pr_nombrecompanyia > a').textContent(),
                version: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(15) > table > tbody > tr > td').textContent(),
                nif: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(9) > table > tbody > tr:nth-child(8) > td:nth-child(2)').textContent(),
                fecha_efecto : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(9) > table > tbody > tr:nth-child(2) > td:nth-child(4)').textContent(),
                email_asegurado: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(9) > table > tbody > tr:nth-child(2) > td:nth-child(4)').textContent(),
                datos_intervinientes_reparador : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(11) > table > tbody > tr:nth-child(7) > td.valorCampo').textContent(),
                nombre_asegurado: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(8) > table > tbody > tr:nth-child(1) > td.valorCampo').textContent(),
                provincia: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(8) > table > tbody > tr:nth-child(3) > td:nth-child(2)').textContent(),
                tipo_figura:  await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(6) > table > tbody > tr:nth-child(3) > td:nth-child(1) > a').textContent(),
                nombre_figura:  await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(6) > table > tbody > tr:nth-child(3) > td:nth-child(2) > a').textContent(),
                tipo_siniestro : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(15) > table > tbody > tr > td').textContent(),
                fecha_ocurrencia : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(11) > table > tbody > tr:nth-child(1) > td:nth-child(4)').textContent(),
                poblacion: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(7) > table > tbody > tr:nth-child(2) > td:nth-child(2)').textContent(),
                dir: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(7) > table > tbody > tr:nth-child(1) > td:nth-child(2)').textContent(),
                codigo_postal: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(7) > table > tbody > tr:nth-child(1) > td:nth-child(4)').textContent(),
                ramo : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(9) > table > tbody > tr:nth-child(1) > td:nth-child(2)').textContent(),
            }

            console.log(data);
            
            await browser.close();
            return { status: 200, data}

        }catch(error){await browser.close()}
    })();
}

async function login_liberty(browser, page, dato, user, pass){
    try {
        await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
        if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
            await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
            await sleep(1000);  //demora de 3000ms
        } 
        await page.fill('input[id="' + dato.id_user + '"]', user); // busco los campos indicados y los lleno con la informacion suministrada
        await page.fill('input[name="' + dato.id_pass + '"]', pass); // busco los campos indicados y los lleno con la informacion suministrada
        await page.click('text='+ dato.boton_login );    // doy clic en el boton con las propiedades indicadas

        return { status: 200, message: "Logueado con éxito", data: []}

    } catch (error) {
        await browser.close(); //cierro navegador
        if (error instanceof playwright.errors.TimeoutError) {
            console.log( " Error: Tiempo de ejecución, algun parametro no ha sido encontrado");
            return { status: 400, message: "Error: Tiempo de ejecución, algun parametro no ha sido encontrado", data: []}
        }
    }
}

//Loguin
async function login_sinexia( browser, page, dato, user, pass){
    try {
        await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
        if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
            await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
            await sleep(1000);  //demora de 3000ms
        } 

        let frameObject = page.frame({ name: 'fraPrincipal' });

        if (!frameObject) { throw Error('Could not find frame with name: link') }
        await frameObject.locator('input[id="' + dato.id_user + '"]').focus('input[id="' + dato.id_user + '"]')
        await frameObject.type('input[id="' + dato.id_user + '"]', user, {delay: 100});

        page.keyboard.press('Tab'); 
        await frameObject.locator('input[id="' + dato.id_pass + '"]').focus('input[id="' + dato.id_pass + '"]')
        await frameObject.type('input[id="' + dato.id_pass + '"]', pass, {delay: 100});

        page.keyboard.press('Enter'); 
        await sleep(10000);

        return { status: 200, message: "¡Logueado con éxito!", data: [] }

    } catch (error) {
        await browser.close();      //cierro navegador
        if (error instanceof playwright.errors.TimeoutError) {
            console.log( " Error: Tiempo de ejecución, algun parametro no ha sido encontrado");
            return { status: 400, message: "Error: Tiempo de ejecución, algun parametro no ha sido encontrado", data: []}
        }
    }
}

async function ListaMensajes(data, user, pass, exp, fecha_encargo){
        // Inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        try{
            //login
            const response = await login_sinexia( browser, page, data, user, pass);
            if(response.status != 200){return await browser.close()}

            //Buscar expediente
            let busqueda = await buscarExpediente(browser, page, exp, fecha_encargo);
            if(busqueda.status != 200) {await browser.close(); return busqueda}

            frameObject = page.frame({ name: 'fraPrincipal' });
            await frameObject.locator('#tabMensaje > a').click();

            await sleep(2000);
            let lista = await frameObject.$$eval('#gridbox > div.objbox > table > tbody > tr', (spans) => spans.map((span) => span.innerHTML));

            lista.shift();
            lista = lista.map(element => {
                let cadena = element.split('<td align="left" valign="middle">');
                cadena = cadena.map(item => item.substring(0, item.indexOf('</td>')));
                return {codigo: cadena[1], tipo: cadena[2], origen: cadena[3], usuario: cadena[4], fecha: cadena[5]};
            })

            if( lista.length == 0 ){
                await browser.close();
                return { status: 200,  message: "No hay mensajes en este expediente", data: [] }
            }
    
            await browser.close();
            return { status: 200, message: "La consulta ha sido exitosa", data: lista  }            

        }catch(err){ await browser.close() }
}

async function SubirMensajes({data, user, pass, siniestro, text, fecha_encargo, tipo}){
    // Inicio navegador
    const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
    const context = await browser.newContext(); // usa el modo incognito
    const page = await context.newPage();   //abre una nueva paguina del navegado

    try{
        //login
        const response = await login_sinexia( browser, page, data, user, pass);
        if(response.status != 200){return await browser.close()}

        //Buscar expediente
        let busqueda = await buscarExpediente(browser, page, siniestro, fecha_encargo);
        if(busqueda.status != 200) {await browser.close(); return busqueda}

        frameObject = page.frame({ name: 'fraPrincipal' });
        await frameObject.locator('#tabMensaje > a').click();
        await sleep(2000);

        await frameObject.locator('body > div.layerExpediente > div:nth-child(6) > table > tbody > tr > td > ul > li > a').click();
        await sleep(1500);
        
        await frameObject.locator('body > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > textarea').focus();
        await frameObject.type('body > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > textarea', text);


        //Seleccionar Tipo
        const lista_text = await frameObject.$$eval('#codigo_mensaje > option', (spans) => spans.map((span) => span.textContent.toLowerCase()));
        const lista = await frameObject.locator('#codigo_mensaje').innerHTML();
        
        let lista_code = lista.split('value="').map(element =>  element.substring(0, element.indexOf('">')));
        lista_code.splice(0, 2);

        
        let code = lista_code[lista_text.indexOf(tipo.toLowerCase()) - 1];
        if(code == undefined){ await browser.close(); return { status: 200,  message: "El campo tipo es incorrecto, no existe ninguna opción con ese nombre. Estas son las opciones disponibles", data: lista_text }}

        await frameObject.locator(`#codigo_mensaje`).selectOption(`${code}`);

        // await frameObject.locator('#tabs10 > ul > li > a').click();

    }catch(e){console.log(e); await browser.close()}
}

module.exports = { listaExp, XMLexp, ListaMensajes, SubirMensajes};