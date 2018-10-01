$(function () {
  $('.slide-btn').on('click', function () {
    //点击按钮旋转
    $('.slide-btn i').toggleClass('down');
    //点击按钮导航box上下滑动
    if ($('.slide-btn i').hasClass('down')) {
      $('.slide-bar').hide();
      $('.slide-box').animate({ 'height': '3.3rem' })
    } else {
      $('.slide-bar').show();
      $('.slide-box').animate({ 'height': 0 })
    }
  })
  //设置slide-bar的宽度
  if (!$('.slide-btn i').hasClass('down')) {
    var w = 0;
    $('.slide-bar li').each(function (index, value) {
      w += $(value).innerWidth();
    })
    $('.slide-bar').width(w);
  }
  // 设置拖动事件
  scrollBar();
  // 轮播图
  var swiper = new Swiper('.swiper-container', {
    
    autoplay: {
      delay: 2000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
    },
    disableOnInteraction: false,
    loop: true
  })
})

//封装鼠标拖动导航栏函数
function scrollBar(e) {
  var slide_bar = document.querySelector('.slide-bar');
  var fw = parseInt(document.getElementsByTagName('html')[0].style.getPropertyValue("font-size"));
  var w = slide_bar.offsetWidth;
  var startX = 0,
    moveX = 0,
    distanceX = 0,
    currentX = 0;
  var maxLeft = 0;
  var minLeft = -w + 7.2 * fw - 0.8 * fw;
  var maxSlideLeft = 20;
  var minSlideLeft = -w + 7.2 * fw - 0.8 * fw - 20;
  // 注册手指滑动事件
  slide_bar.addEventListener('touchstart', function (e) {
    startX = e.targetTouches[0].clientX;
  })
  slide_bar.addEventListener('touchmove', function (e) {
    moveX = e.targetTouches[0].clientX;
    distanceX = moveX - startX;
    if (currentX + distanceX >= maxSlideLeft || currentX + distanceX <= minSlideLeft) {
      return;
      
    }
    slide_bar.style.transition = 'none';
    slide_bar.style.left = (currentX + distanceX) / fw + 'rem';
  })
  slide_bar.addEventListener('touchend', function (e) {
    if (currentX + distanceX < minLeft) {
      currentX = minLeft;
      slide_bar.style.transition = 'all 0.5s';
      slide_bar.style.left = minLeft / fw + 'rem';
    } else if (currentX + distanceX > maxLeft) {
      currentX = maxLeft;
      slide_bar.style.transition = 'all 0.5s';
      slide_bar.style.left = maxLeft / fw + 'rem';
    } else {
      currentX += distanceX;
    }
  })
}
