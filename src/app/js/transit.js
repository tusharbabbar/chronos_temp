window.showCuration = function(value){
  if (value === 0){
    console.log('yes')
    $('#curation-hover').css('right','-55%')
  }
  else if (value === 1) {
    $('#curation-hover').css('right','0px')
  }
}

window.toggleLeftNav = function(){
  if ($('#nav-left').css('left') === '-300px'){
    newWidth = $(window).width() - 300;
    $('#nav-left').css('left','0px')
    $('#main-view').css('left', '300px')
    $('#nav-top').css('left', '300px')
    $('#nav-top').css('width', newWidth)
    $('#main-view').css('width', newWidth-7)
    console.log('yes')
  }
  else if ($('#nav-left').css('left') === '0px') {
    newWidth = '100%';
    $('#nav-left').css('left','-300px')
    $('#main-view').css('width', newWidth)
    $('#nav-top').css('width', newWidth)
    $('#main-view').css('left', '0px')
    $('#nav-top').css('left', '0px')
  }
}
