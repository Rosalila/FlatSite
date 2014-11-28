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
