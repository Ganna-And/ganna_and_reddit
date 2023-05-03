let i = 1

const lalala = setInterval(function(){
    console.log('Here is a message' + i);
    i = i+1
}, 2000);

setTimeout(function(){
    clearInterval(lalala)}, 12000);


