
let wh = $('body').height();

let viewCurrentIndex = 0;
let changeColor = false;
let endPage = false;
let lock = false

const vis_text = ["权限","颜色","大小","纹理","","","","","","","",""]
$('.container').scroll(function () {
    let top = $(this).scrollTop();

    if(top >= trigger_dis('.end') + 0.1 * wh && !endPage){
        $("#choice").css('opacity', 0);
        endPage = true;

        $('.container').scrollTop( $('.end').position().top )
        $(".end-img").attr('src', 'images/end.gif');
    } else if(top >= trigger_dis('.end')){
        //已经显示endpage
    }else if(top < trigger_dis('.end') - wh * 0.2 && top >= trigger_dis('#step_choice_2') + wh){
        $("#choice").css('opacity', 1);
        endPage = false;
    }
    else if (top >= trigger_dis('#step_choice_2') +0.4 *wh && top < trigger_dis('#step_choice_2') + wh && !lock) { // 选择题第3屏
        
        // $("#question2").css('opacity', 0);
        // $("#choice").css('opacity', 1);
        console.log('in 3')
        $(this).scrollTop($('#step_choice_2').position().top - 0.4 *wh);
        $('#choice_hint').css('display', 'block')
    }  else if (top >= trigger_dis('#step_choice_1') +0.4 *wh && top < trigger_dis('#step_choice_1') + wh  && !lock) { // 选择题第2屏
        console.log('in 2')
        // $("#question2").css('opacity', 0);
        // $("#choice").css('opacity', 1);
        $(this).scrollTop($('#step_choice_1').position().top - 0.4 *wh);
        $('#choice_hint').css('display', 'block')
    } else if (top >= trigger_dis('#block_behind_q0') + 0.8 * wh ) {
        $(".question_hint").css('display', 'none');
        $('#vs_story_0').css('display', 'inline-block')
    } else if (top > trigger_dis('#step_choice_0') +0.4 *wh && top < trigger_dis('#step_choice_0') + wh && !lock) { // 选择题第一屏
        console.log('11111')
        $("#question2").css('opacity', 0);
        $("#choice").css('opacity', 1);
        $(this).scrollTop($('#step_choice_0').position().top - 0.4 *wh);
        // stopScrollPhone('container')
        $('#choice_hint').css('display', 'block')
    } else if(top >= trigger_dis('#step_vis_final') + 2.2 * wh){
        //
        $("#question2").css('opacity', 0);
        $('#choice').css('opacity', 1)
        console.log('here')
    }
    else if (top >= trigger_dis('#step_vis_final') + 1.2 * wh) {// 第二个问题第二屏
        console.log('fjeoiawj eiojwa')
        $("#question2").css('opacity', 1)
            .css({background:"#fbfa6a", transition: "0.5s"});
        $('#choice').css('opacity', 0)
        $('#questionMark2').css({fill: "64ae61", transition: "0.5s"});
        $('#questionMark2').attr("d", "M450.602458 665.598073a62.463819 62.463819 0 0 0 122.879645 0L614.441984 102.399704A102.615282 102.615282 0 0 0 512.04228 0 105.256116 105.256116 0 0 0 409.642577 112.639674L450.602458 665.598073z m61.439822 153.599556a102.399704 102.399704 0 1 0 102.399704 102.399703 96.740773 96.740773 0 0 0-102.399704-102.399703z")
        $('#questionText2_1').text("有些隐私泄露是我们自己")
        $('#questionText2_2').text("在不经意间晒出去的")
    }else if (top >= trigger_dis('#step_vis_final') + 0.8 * wh) { // 第二个问题第一屏
        $("#vis").css('opacity', 0);
        $("#question2").css('opacity', 1)
                    .css({background:"#64ae61", transition: "0.5s"});
        $('#questionMark2').attr("d", "M500.382 0.006c-177.646 19.719-276.341 96.721-296.085 230.93-3.949 43.437 17.757 67.13 65.143 71.066 23.667 3.961 43.411-13.808 59.207-53.296 23.692-82.9 80.862-124.35 171.735-124.35 110.479 7.885 169.698 63.156 177.671 165.8 0 94.759-64.313 110.202-99.248 138.774-44.267 36.218-73.217 72.952-108.655 135.216-29.779 52.314-34.91 164.227-34.91 164.227 0 47.373 21.655 71.066 65.143 71.066 39.413 0 61.194-23.693 65.155-71.066 0 0 5.219-125.594 55.925-181.129 57.472-62.942 194.749-107.071 198.698-268.922C804.365 108.561 697.772 15.789 500.382 0.006zM500.382 859.162c-45.524 0-82.409 36.91-82.409 82.41 0 45.523 36.885 82.422 82.409 82.422s82.422-36.898 82.422-82.422c0-45.5-36.898-82.41-82.422-82.41z")
                            .css({fill: "fbfa6a"});
        $('#questionText2_1').text("在怀疑APP窃取我们隐私的同时");
        $('#questionText2_2').text("我们自己保护好隐私了吗");
    }else if(top >= trigger_dis('#step_vis_0')){//vis
        $("#question").css('opacity', 0);
        $("#question2").css('opacity', 0);
        $("#vis").css('opacity', 1);
        $("#user-introduction").css('opacity', 0);
        for(let i = 17; i--; i >= 0){
            if (top >= trigger_dis('#step_vis_' + i)) {
                $("#vis-title").text(vis_text[i]);
                action(i);
                return;
            } 
        }
    }
    else if(top >= trigger_dis('#step_user_intro')){//user-introduction
        $("#vis").css('opacity', 0);
        $("#user-introduction").css('opacity', 1);
        $("#question").css({opacity: 0, transition: "1s"});
        console.log("...")
    }else if (top >= (1.5 * wh)) {
        $("#user-introduction").css('opacity', 0);
        $("#question").css('opacity', 1)
            .css({background:"#64ae61", transition: "0.5s"}); // TODO: add transition?
        $('#questionMark').css({fill: "fbfa6a", transition: "0.5s"});
        $('#questionText').text("这些APP会收集多少隐私信息")
    }else{
        $("#question").css('opacity', 1)
            .css({background:"#fbfa6a", transition: "0.5s"});
        $('#questionMark').css({fill: "64ae61", transition: "0.5s"});
        $('#questionText').text("你手机上装了多少个APP")
    }
});

function trigger_dis(d) {
    return $(d).position().top - wh * 0.8;
}

function action(index){
    if(index === viewCurrentIndex) return;
    
    if(index > viewCurrentIndex){
        actionList[index]();
    }else{
        backList[index]();
    }
    viewCurrentIndex = index;
}

let quesObject = ['好奇', '金钱', '便利'];
function questionAns(value) {
    console.log(value)
    let question = value.split('_')[0];
    let selected = value.split('_')[1];
    lock = true;
    // $('.container').scrollTop($('#step_choice_'+question).position().top + 0.5*wh);
    // enableScrollPhone('container')
    $('.container').scrollTop($('#block_behind_q'+question).position().top + 0.1 * wh);
    if(selected == 'pos') {
        $('.vs_pos').css({'width': '80vw', transition:'0.5s'});
        $('.vs_neg').css({'width': '20vw', transition:'0.5s'});
    } else {
        $('.vs_neg').css({'width': '80vw', transition:'0.5s'});
        $('.vs_pos').css({'width': '20vw', transition:'0.5s'});
        $('#ans_result_'+question).text('啊哦，这可能导致...')
    }
    $('#vs_text_neg').text(quesObject[question])    
    // $('#vs_story').html('Story_' + question);
    $('#choice_hint').css('display', 'none')
    lock = false
}


// function stopScrollPhone() {
//     var fixed = document.getElementById('container');
//     fixed.addEventListener('touchmove', function(e) {
//         e.preventDefault();
//     }, false);
// }

// function enableScrollPhone() {
//     var fixed = document.getElementById('container');

//     fixed.removeEventListener('touchmove', function(e) {
//         e.preventDefault();
//     }, false);
// }