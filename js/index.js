$(function () {
  $('.slide-btn').on('click', function () {
    //点击按钮旋转
    $('.slide-btn i').toggleClass('down');
    //点击按钮导航box上下滑动
    if ($('.slide-btn i').hasClass('down')) {
      $('.slide-box').animate({ 'height': '3.3rem' })
    } else {
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
    loop: true
  })
  // 回到顶部按钮
  $(document).scroll(function () {   //获取滚动条初始高度
    var topD = $(document).scrollTop();  //获取滚动条初始高度的值 ：0
    if (topD <= 200) {  //当滚动条高度为0时
      $('.to-top').addClass('display-btn');
    } else {
      $('.to-top').removeClass('display-btn');
    }
    $('.to-top').on('click', function () {
      //在执行动画之前加入stop(),停止当前的动画再执行此事件，否则回到顶部之后不能下拉
      $('html').stop().animate({ scrollTop: 0 }, 500);
      return false;
    })
  })

})

//封装导航栏函数
function scrollBar(e) {
  var slide_bar = document.querySelector('.slide-bar');
  //计算根元素字体大小
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
    //判断是否超出边界，超出返回
    if (currentX + distanceX >= maxSlideLeft || currentX + distanceX <= minSlideLeft) {
      return;
    }
    // 设置导航条当前的位置
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
  //在此处设置index,方便后面多个函数共同使用
  var index = 0;
  //设一个变量用来记录index的值，用来确认tab栏的内容的进来方向
  var flag = 0;
  // 给头部导航按钮注册点击事件
  $('.slide-bar>li').on('click', function () {
    // 获取当前被点击的索引
    index = $(this).index();
    // 计算出被点击的元素的左侧的li的总长度
    var nw = 0;
    for (var i = 0; i < index; i++) {
      nw += $('.slide-bar>li').eq(i).innerWidth();
    }
    clickBar();
    // 左右横向导航条操作
    $(this).addClass('active').siblings().removeClass('active');
    $('.slide-box-bd>span').eq(index).addClass('active').siblings().removeClass('active');

  })
  // 下拉导航框操作
  $('.slide-box-bd>span').on('click', function () {
    index = $(this).index();
    clickBar();
    $(this).addClass('active').siblings().removeClass('active');
    $('.slide-box').css('height', 0);
    $('.slide-btn i').removeClass('down');
    $('.slide-bar>li').eq(index).addClass('active').siblings().removeClass('active');

  })
  //将导航偏移封装，便于复用
  function clickBar() {
    // 计算出被点击的元素的左侧的li的总长度
    var nw = 0;
    for (var i = 0; i < index; i++) {
      nw += $('.slide-bar>li').eq(i).innerWidth();
    }
    //假设一个固定值为2rem,判断当前被点击的li的左边的li的总长度是否大于2rem，当大于2rem时，则ul的左偏移取 3rem-当前li的左边的li的总长度
    //判断当点击的li的左边的li的总长度比较小，ul的左偏移需要为0，防止后续位置不能还原
    if (2 * fw - nw >= 0) {
      slide_bar.style.transition = 'all 0.5s';
      slide_bar.style.left = 0;
      currentX = 0;
    } else if (2 * fw - nw <= minLeft) {
      //当li的左边的li的总长度比较大，ul的左偏移需要为所能取到的最小值
      currentX = minLeft;
      slide_bar.style.transition = 'all 0.5s';
      slide_bar.style.left = minLeft / fw + 'rem';
    } else {
      // 当没有超出范围时，根据索引值设定相应的偏移
      slide_bar.style.transition = 'all 0.5s';
      slide_bar.style.left = (2 * fw - nw) / fw + 'rem';
      currentX = (2 * fw - nw);
    }
    //根据点击的按钮控制li进来的方向，达到切换的效果
    // 判断当前点击的按钮在原来的前面还是后面
    if (flag < index) {
      //当前li显示，其他的隐藏
      for (var i = 0; i < $('.content-box')[0].children.length; i++) {
        $('.content-box')[0].children[i].style.left = '-7.2rem';
      }
      // 当前点击的按钮在原状态按钮的后面，则先把让当前的内容栏从右侧进入
      $('.content-box>li').eq(index).css('left', '7.2rem');
      $('.content-box>li').eq(index).animate({ 'left': 0 }, 200);
      // 将当前的索引值赋给flag，下次切换时使用
      flag = index;
    } else if (flag > index) {
      //当前li显示，其他的隐藏
      for (var i = 0; i < $('.content-box')[0].children.length; i++) {
        $('.content-box')[0].children[i].style.left = '-7.2rem';
      }
      // 当前点击的按钮在原状态按钮的前面，则先把让当前的内容栏从左侧进入
      $('.content-box>li').eq(index).css('left', '-7.2rem');
      $('.content-box>li').eq(index).animate({ 'left': 0 }, 200);
      // 将当前的索引值赋给flag，下次切换时使用
      flag = index;
    }
  }
}
