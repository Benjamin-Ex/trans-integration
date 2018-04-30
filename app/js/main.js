$(function(){
  console.log('initialized');

  $(".hamburger").click(function(){
    $(this).toggleClass("is-active");
    $(".mobile-menu").toggle();
  });
});
