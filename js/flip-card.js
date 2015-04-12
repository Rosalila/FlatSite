var init = function() {
  var card = document.getElementById('card');
  
  document.getElementById('card').addEventListener( 'click', function(){
    card.toggleClassName('flipped');
  }, false);
};

window.addEventListener('DOMContentLoaded', init, false);


function hideAll() {
  $('#detail1').hide('slow');
  $('#detail2').hide('slow');
  $('#detail3').hide('slow');
  $('#detail4').hide('slow');
  $('#detail5').hide('slow');
  $('#detail6').hide('slow');
}

function showDetail(num) {
  if(num!=1)
    $('#detail1').hide('slow');
  if(num!=2)
    $('#detail2').hide('slow');
  if(num!=3)
    $('#detail3').hide('slow');
  if(num!=4)
    $('#detail4').hide('slow');
  if(num!=5)
    $('#detail5').hide('slow');
  if(num!=6)
    $('#detail6').hide('slow');

  //if($('#detail'+num).is(":visible"))
    $('#detail'+num).show('slow');
}

function test()
{
  $('#card1').toggleClassName('flipped');
}
