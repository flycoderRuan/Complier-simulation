var MiddlePackageAlphabet=[
  '0','1','2','3','4','5','6','7','8','9',
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]

function randomNum(minNum,maxNum){
  switch(arguments.length){
    case 1:
      return parseInt(Math.random()*minNum+1,10);
      break;
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break;
    default:
      return 0;
      break;
  }
}
function generateVerificationCode(){
  var code="";
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length - 1)];
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length - 1)];
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length - 1)];
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length-1)];
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length-1)];
  code+=MiddlePackageAlphabet[randomNum(0,MiddlePackageAlphabet.length-1)];
  return code;
}
// console.log(generateVerificationCode())
module.exports = generateVerificationCode
