$(document).ready(function(){
    // Carousel Entries from Blog show only when clicked
    
    function hideOsloBlog(){
        $("#oslo-blog-entry0").hide();
        $("#oslo-blog-entry1").hide();
        $("#oslo-blog-entry2").hide();
        $("#oslo-blog-entry3").hide();
        $("#oslo-blog-entry4").hide();
        $("#oslo-blog-entry5").hide();
    }
    hideOsloBlog();
    $("#oslo-blog-entry0").show();

    $('#blog-entry #oslo-slider #carousel-example-generic').on('slid.bs.carousel', function() {
        var currentIndex = $('div.active').index();
        hideOsloBlog();
        $("#oslo-blog-entry" + currentIndex).show();
    });
    
});
