const fs = require('fs');

async function xml( arrayExp ) {

    // var data_array_exp =    [ 'exp','dir', 'compania', 'fecha_encargo', 'obsevaciones', 'tipo_siniestro', 'poliza', 'ramo','causa_siniestro', 'version', 'fecha_ocurrencia', 'fecha_efecto', 'nif', 'nombre' ];   
    // causa_siniestro:: No requerido

    //XML
    const DatosPoliza =  
        `<DatosPoliza>
            <IdPoliza>${arrayExp.poliza}</IdPoliza>

            <FechaEfecto>${arrayExp.fecha_efecto}</FechaEfecto>

            <CodigoEntidad>
                <CodigoInterno>${arrayExp.compania}</CodigoInterno>
                <CodigoDGS>C0133</CodigoDGS>
            </CodigoEntidad>

            <DatosRamo>
                <DescripcionRamo>${arrayExp.ramo}</DescripcionRamo>
            </DatosRamo>

            <OtrosDatos>
                <AseguradosPoliza>
                    <Asegurado>
                        <Email>${arrayExp.email_asegurado}</Email>
                        <Nombre>${arrayExp.nombre_asegurado}</Nombre>
                    </Asegurado>
                </AseguradosPoliza>
            </OtrosDatos>
        </DatosPoliza>`;

    const DatosSiniestro = 
        `<DatosSiniestro>
            <IdSiniestroEntidad>${arrayExp.exp}</IdSiniestroEntidad>
            <FechaDeclaracion>${arrayExp.fecha_encargo}</FechaDeclaracion>
            <FechaOcurrencia>${arrayExp.fecha_ocurrencia}</FechaOcurrencia>
            <PosicionSiniestro></PosicionSiniestro>

            <SituacionesSiniestro>
                <Situacion>
                    <NumeroOrden></NumeroOrden>
                    <SituacionSiniestro></SituacionSiniestro>
                    <FechaSituacion></FechaSituacion>
                </Situacion>
            </SituacionesSiniestro>

            <DescripcionSiniestro>${arrayExp.version}</DescripcionSiniestro>

            <AccionesSiniestro>
                <Accion>
                    <AccionSiniestro></AccionSiniestro>
                    <FechaAccion></FechaAccion>
                    <DescripcionAccion></DescripcionAccion>
                </Accion>
            </AccionesSiniestro>

            <LugarSiniestro>
                <NombreVia>${arrayExp.dir}</NombreVia>
                <CodigoPostal>${arrayExp.dir.split( ).pop()}</CodigoPostal>
                <Poblacion>${arrayExp.poblacion}</Poblacion>
                <Provincia>${arrayExp.provincia}</Provincia>
            </LugarSiniestro>

            <RiesgosSiniestro>
                <RiesgoRecSin>
                <DescripcionRiesgo>${arrayExp.tipo_siniestro}</DescripcionRiesgo>
                //<Version>${arrayExp.version}</Version>
                </RiesgoRecSin>
            </RiesgosSiniestro>;

            <tomador>
                <nif>${arrayExp.nif}</nif>
                <razonSocial>${arrayExp.nombre}</razonSocial>
                <telefono></telefono>
            </tomador>

            <riesgosPoliza>
                <riesgo>
                    <direccion></direccion>
                </riesgo>
            </riesgosPoliza>

            <FigurasSiniestro>
                <FiguraSiniestro>
                    <Tipo>${arrayExp.datos_intervinientes_reparador}<Tipo>
                </FiguraSiniestro>
            </FigurasSiniestro>

        </DatosSiniestro>`;

    const xml = 
        `<?xml version="1.0" encoding="iso8859-1"?>
        <ProcesosEIAC xsi:schemaLocation="http://www.tirea.es/EIAC/ProcesosEIAC ProcesosEIAC.xsd" xmlns="http://www.tirea.es/EIAC/ProcesosEIAC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Objetos>
            <Siniestro>
                ${DatosPoliza}
                ${DatosSiniestro}
            </Siniestro>
        </Objetos>
        </ProcesosEIAC>`;

    const filepath = `Expedientes/${arrayExp.exp} ${arrayExp.compania}.xml`;

    fs.writeFile(filepath, xml, (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
        return { status: 200, message: "Se ha generado el archivo con exito", data: xml  }
    });
}

module.exports = { xml };
