
const { chromium } = require('playwright');

const empresas = {1: 'GENERALI_LIBERTY', 2: 'GENERALI_LIBERTY', 3 : 'SINEXIA'}
const sleep = time => new Promise(resolve => {setTimeout(resolve, time)});

const _listaExp = {
    GENERALI_LIBERTY : async function ( browser, page, dato, user, pass){
        // logueo completo
        Login_GENERALI_and_LIBERTY(browser, page, dato, user, pass);
    
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
        const response = await Login_SINEXIA( browser, page, dato, user, pass)

        if(response.status != 200) return

        frameObject = page.frame({ name: 'fraPrincipal' });

        await frameObject.locator('img[title="Expedientes Nuevos"]').click();
        await sleep(3000);

        frameObject = page.frame({ name: 'fraPrincipal' });

        const lista = await frameObject.$$eval('#gridbox > div.objbox > table > tbody > tr.ev_modern > td:nth-child(1)', (spans) => spans.map((span) => span.textContent));

        if( lista.length == 0 ){
            await browser.close();
            return { status: 200,  message: "No hay expedientes nuevos", data: [] }
        }

        await browser.close();
        return { status: 200, message: "La consulta ha sido exitosa", data: lista  }
    }
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
async function XMLexp( dato, user, pass, exp ){
    return (async () => {

        // Inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        try{
            //login
            const response = await Login_SINEXIA( browser, page, dato, user, pass)

            if(response.status != 200) return
            frameObject = page.frame({ name: 'fraMenus' });

            await frameObject.locator('#imagen2 > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > img').click()
            await sleep(2000);

            await frameObject.locator('#imagen2 > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td.standartTreeRow > span > a').click()
            await sleep(4000);

            frameObject = page.frame({ name: 'fraPrincipal' });
            await frameObject.locator('#tabs10 > ul > input').focus();
            await frameObject.type('#tabs10 > ul > input', exp, {delay: 100});

            page.keyboard.press('Enter'); 

            await frameObject.locator('#det0 > td:nth-child(2) > a').click();

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
                fecha_efecto : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(9) > table > tbody > tr:nth-child(1) > td:nth-child(4)').textContent(),
                email_asegurado: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(7) > table > tbody > tr:nth-child(5) > td:nth-child(2)').textContent(),
                datos_intervinientes_reparador : await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(11) > table > tbody > tr:nth-child(7) > td.valorCampo').textContent(),
                nombre_asegurado: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(8) > table > tbody > tr:nth-child(1) > td.valorCampo').textContent(),
                provincia: await frameObject.locator('body > div.layerExpediente > form > fieldset:nth-child(8) > table > tbody > tr:nth-child(3) > td:nth-child(2)').textContent(),
            }

            await frameObject.locator('#tabInforme > a').click();
            await sleep(3000);

            frameObject = page.frame({ name: 'fraPrincipal' });

            data = {
                ...data,
                dir: await frameObject.locator('body > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr:nth-child(4) > td.valorCampoBorder').textContent(),
                tipo_siniestro : await frameObject.locator('body > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr:nth-child(6) > td:nth-child(2)').textContent(),
                fecha_ocurrencia : await frameObject.locator('body > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr:nth-child(7) > td:nth-child(2)').textContent(),
                ramo : await frameObject.locator('body > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr:nth-child(18) > td.valorCampo').textContent(),
                poblacion: await frameObject.locator('body > table > tbody > tr:nth-child(2) > td > table:nth-child(4) > tbody > tr:nth-child(5) > td:nth-child(4)').textContent(),
            }

            console.log(data);
            
            await browser.close();
            return data;
        }catch(error){await browser.close()}
    })();
}

async function Login_GENERALI_and_LIBERTY(browser, page, dato, user, pass){
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
async function Login_SINEXIA( browser, page, dato, user, pass){
    try {
        await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
        if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
            await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
            await sleep(1000);  //demora de 3000ms
        } 

        let frameObject = page.frame({ name: 'fraPrincipal' });

        if (!frameObject) { throw Error('Could not find frame with name: link') }
        await frameObject.locator('input[id="' + dato.id_user + '"]').focus('input[id="' + dato.id_user + '"]')
        await frameObject.type('input[id="' + dato.id_user + '"]', user, {delay: 200});

        page.keyboard.press('Tab'); 
        await sleep(2000);
        await frameObject.locator('input[id="' + dato.id_pass + '"]').focus('input[id="' + dato.id_pass + '"]')
        await frameObject.type('input[id="' + dato.id_pass + '"]', pass, {delay: 200});

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

module.exports = { listaExp, XMLexp };