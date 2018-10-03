function slideBar() {
    var layout = document.querySelector('.category-layout');
    var slide_box = document.querySelector('.left-nav');
    var slideB = document.querySelector('.left-nav>ul');
    var right_content = document.querySelector('.right-content');
    // 所有的li
    var lis = slideB.children;
    // 所有的右侧的div块
    var divs = right_content.children;
    //计算根元素字体大小
    var fw = parseInt(document.getElementsByTagName('html')[0].style.getPropertyValue("font-size"));
    //设置left-nav的高度
    slide_box.style.height = layout.offsetHeight - 2 * fw + 'px';
    var startY = 0,
        moveY = 0,
        distanceY = 0,
        currentY = 0;
    //静止时的边界
    var maxTop = 0;
    var minTop = slide_box.offsetHeight - slideB.offsetHeight;
    // 滑动时的边界
    var maxSlideTop = 100;
    var minSlideTop = minTop - 100;
    //注册手指按下事件
    slideB.addEventListener('touchstart', function (e) {
        startY = e.targetTouches[0].clientY;
    })
    // 注册手指滑动事件
    slideB.addEventListener('touchmove', function (e) {
        moveY = e.targetTouches[0].clientY;
        distanceY = moveY - startY;
        //判断是否超出边界，超出返回
        if (currentY + distanceY >= maxSlideTop || currentY + distanceY <= minSlideTop) {
            return;
        }
        // 在限定范围内的状态
        slideB.style.transition = "none";
        slideB.style.top = currentY + distanceY + "px";
    });
    // 注册手指抬起事件
    slideB.addEventListener("touchend", function (e) {
        // 判断，小于最小值时回到最小位置
        if (currentY + distanceY < minTop) {
            currentY = minTop;
            slideB.style.transition = "top .5s";
            slideB.style.top = minTop + "px";
        }else if (currentY + distanceY > maxTop) {
            // 当超出最大值时，回到最大位置
            currentY = maxTop;
            slideB.style.transition = "top .5s";
            slideB.style.top = maxTop + "px";
        }else {
            // 更新currentY值，使得下次滑动连贯
            currentY += distanceY;
        }
    })
    //给li添加索引
    for(var i = 0; i < lis.length ; i++) {
        lis[i].index = i;
    }
    // 设置变量记录index的值
    var flag = 0;
    slideB.addEventListener('click', function(e){
        //移除所有的li的类样式
        for(var i = 0; i < lis.length; i++) {
            lis[i].classList.remove('active');
        }
        //当前被点击的li
        li = e.target.parentNode;
        //给当前的li添加类名
        li.classList.add('active');
        // 当前被点击的li的索引值
        var index = li.index;
        //调用函数来控制ul被点击时滚动的方向
        slideBtn(index);
    })
    // 添加滚动事件
    $(".right-content").scroll(function () {
        // right - content滚出的高度  
        var cT = $(".right-content").scrollTop();
        //设变量h记录右边超出块的高度之和
        var h = 0;
        // 遍历寻找出对应的i值
        for(var i = 0; i < divs.length; i++) {
            h += divs[i].offsetHeight;
            //当右板块的top值的绝对值大于divs之前的盒子的高度之和时，即当前显示第i个盒子
            if (Math.abs(cT) > h - divs[i].offsetHeight && Math.abs(cT) < h) {
                //移除所有的li的类样式
                for (var j = 0; j < lis.length; j++) {
                    lis[j].classList.remove('active');
                }
                // 给当前的li添加类样式
                lis[i].classList.add('active');
                //调用函数来控制ul随着右侧高度变化滚动的方向
                slideBtn(i);
            }
        }    
    })
    // 封装左侧滚动条滚动判断的函数（利用当前li前面的所有li的高度之和去和相关的高度做比较）
    function slideBtn(index) {
        // 当前状态按钮是在上次状态按钮之后，滚动条有向上滚动的趋势，top值减小
        if (index > flag) {
            // 判断是否超出界限，超出界限则滚动条的top为最小值
            if (-index * 0.9 * fw < minTop) {
                slideB.style.transition = "top .5s";
                slideB.style.top = minTop + "px";
                currentY = minTop;
            } else {      // 判断是否超出界限，在界限内滚动条会向上移动，当前状态按钮跑到最顶部
                slideB.style.transition = "top .5s";
                slideB.style.top = -index * 0.9 * fw + "px";
                currentY = -index * 0.9 * fw;
            }
            // 设置当前的flag值，便于下次使用
            flag = index
        } else if (index < flag) {   // 当前状态按钮是在上次状态按钮之前，滚动条有向下滚动的趋势，top值增大
            // 将当前状态及前面所有的li的高度之和与父盒子的高度作比较来判断
            if ((index + 1) * 0.9 * fw > slide_box.offsetHeight) {
                // 设置相应的top值，使得当前状态的li处于底部
                slideB.style.transition = "top .5s";
                slideB.style.top = slide_box.offsetHeight - (index + 1) * 0.9 * fw + "px";
                currentY = slide_box.offsetHeight - (index + 1) * 0.9 * fw;
            } else {   //超出界限，设置top值为最大值
                slideB.style.transition = "top .5s";
                slideB.style.top = 0;
                currentY = 0;
            }
            flag = index
        }
    }
}

window.onload = function () {
    slideBar();
}