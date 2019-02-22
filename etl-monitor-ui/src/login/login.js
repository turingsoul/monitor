/**
 * Created by Administrator on 2016/12/2.
 */
$(".item input").focus(function(){
    $(this).parents(".item").addClass("active");
}).blur(function(){
    $(this).parents(".item").removeClass("active");
});
