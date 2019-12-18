const actionList = [ 
    initAuthority,
    introColor,
    introSize,
    introTexture,
    overview,
    detail1,
    detail2
];

const backList = [
    introColor_back,
    introSize_back,
    introTexture_back,
    overview_back,
    detail1_back
]

let currentIndex = 0;
window.onload = function(){
    actionList[0]();
    d3.select("#next").on("click", function(){
        if(currentIndex < actionList.length - 1){
            currentIndex ++;
            actionList[currentIndex]();
        }
    });

    d3.select("#back").on("click", function(){
        if(currentIndex > 0){
            currentIndex --;
            backList[currentIndex]();
        }
    });
}


