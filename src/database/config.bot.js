const bot_config = {
    1: {
        uid                     :  2,
        observaciones           :  null,
        boton_login             : 'Entrar',
        nombre_empresa          : 'LIBERTY',
        id_user                 : 'loginAuth.username',
        id_pass                 : 'loginAuth.password', 
        data_excluida           : 'causa_siniestro||vacio',
        boton_acepto_cookies    : 'Aceptar todas las cookies',
        ruta_loguin             : 'https://profesionales.libertyseguros.es/#/login-auth-widget',
        link_exps               : 'https://profesionales.libertyseguros.es/#/home-encargos-container',
        mapeo_lista             : 'body > div.libty > div > div:nth-child(1) > main > div > article.margen-t-2.border-t > div:nth-child(3) > ul > li || div > div > div > article > div.row-component.row-cell.data-box__header.responsive-none > div.col-component.col-cell.col-offset-0.col-9.col-tablet-8.col-mobile-0.horizontal-left.vertical-middle.scroll-default.ov-default > div > div > span.data-box__header-title.txt-bold > h1 > a.link-component',
        mapeo_exp               : `exp::body > div.libty > div > div:nth-child(1) > main > section > article.detalle-encargo-cabecera-container.clearfix.relative.espacio-t-1.espacio-2.sticky-element.z-index-22.solid-background-default.sticky-detalle-encargo-cabecera > div > header > div > span > h1||
                                    dir::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div.row-component.row-cell.espacio-3.responsive-tablet > div.col-component.col-cell.col-offset-0.col-6.col-tablet-100.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2.espacio-r-reset-tablet > div:nth-child(2) > div > dl > span:nth-child(3) > dd||
                                    compania::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div.row-component.row-cell.espacio-3.responsive-tablet > div.col-component.col-cell.col-offset-0.col-6.col-tablet-100.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2.espacio-r-reset-tablet > div:nth-child(2) > div > dl > span:nth-child(4) > dd||
                                    fecha_encargo::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div.row-component.row-cell.espacio-3.responsive-tablet > div.col-component.col-cell.col-offset-0.col-6.col-tablet-100.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2.espacio-r-reset-tablet > div:nth-child(2) > div > dl > span:nth-child(6) > dd||
                                    obsevaciones::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div.row-component.row-cell.espacio-3.responsive-tablet > div.col-component.col-cell.col-offset-0.col-6.col-tablet-100.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2.espacio-r-reset-tablet > div.row-component.row-cell.espacio-3.responsive-none > div > div > span||
                                    boton::body > div.libty > div > div:nth-child(1) > main > section > ul > li:nth-child(2)||
                                    tipo_siniestro::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div > div.row-component.row-cell.espacio-3.responsive-none > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2 > dl > span:nth-child(1) > dd||
                                    poliza::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div > div.row-component.row-cell.espacio-3.responsive-none > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2 > dl > span:nth-child(2) > dd||
                                    ramo::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div > div.row-component.row-cell.espacio-3.responsive-none > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2 > dl > span:nth-child(3) > dd||
                                    causa_siniestro::#causasSiniestrosForm\.causa1||
                                    version::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div > div:nth-child(2) > div > span:nth-child(2)||
                                    fecha_ocurrencia::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div > div.row-component.row-cell.espacio-3.responsive-none > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-l-2 > dl > span:nth-child(1) > dd||
                                    boton::body > div.libty > div > div:nth-child(1) > main > section > ul > li:nth-child(3)||
                                    fecha_efecto::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(2) > div > div > div.col-component.col-cell.col-offset-0.col-8.col-tablet-100.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-3 > div > div:nth-child(1) > div > dl > span:nth-child(2) > dd||
                                    nif::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(3) > div > div > div.collapsible-area__body > div > div > div > div > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2 > dl > span:nth-child(1) > dd||
                                    nombre::body > div.libty > div > div:nth-child(1) > main > section > article.menu-tabs__container > div > article > div:nth-child(3) > div > div > div.collapsible-area__body > div > div > div > div > div.col-component.col-cell.col-offset-0.col-6.col-tablet-0.col-mobile-0.horizontal-left.vertical-top.scroll-default.ov-default.espacio-r-2 > dl > span:nth-child(2) > dd`,
    },
    
    2: {
        uid                     :  1,
        observaciones           : null,
        boton_acepto_cookies    : null,
        mapeo_exp               : null,
        data_excluida           : null,
        boton_login             : 'Aceptar',
        id_user                 : 'username',
        nombre_empresa          : 'GENERALI',
        id_pass                 : 'password', 
        ruta_loguin             : 'https://www.generali.es/arq_genernetPortalFormWeb/profesionalPortal.po',
        link_exps               : 'https://www.generali.es/arq_genernetPortalFormWeb/profesionalPortal.po',
        mapeo_lista             : '#orderDesktop > div.moduleCenter > div.moduleContent.tab1Content.active > div.listOrder.divLoader > div.moduleList.moduleListType1 || ul > li.moduleListLi2.linkOrderDetail.liLinked > p:nth-child(3) > span:nth-child(2)',
    },

    3: {
        uid                     :  3,
        observaciones           : null,
        boton_acepto_cookies    : null,
        mapeo_exp               : null,
        data_excluida           : null,
        mapeo_lista             : null,
        boton_login             : 'ENTRAR',
        id_user                 : 'login',
        nombre_empresa          : 'SINEXIA',
        id_pass                 : 'password', 
        ruta_loguin             : 'http://sx-expert.sinexia.es/',
        link_exps               : 'https://www.generali.es/arq_genernetPortalFormWeb/profesionalPortal.po',
    }
}

module.exports = {bot_config}