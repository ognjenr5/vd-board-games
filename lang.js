function getLang () { 
    return $(".lang-switch").prop('checked') ? 'en' : 'rs'
}

$(document).ready(function () {
    $(".lang-switch").click(function () { 
        let lang = getLang()
        let id = $(this).attr('id').split('-')
        
        let newPage = id[1] + (id[2] == 'rs' ? '-en' : '') + '.html'

        window.location.href = newPage;
    });

});