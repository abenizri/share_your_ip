var myIp =  ''
var toggle

$(function() {

    chrome.storage.sync.get('ip', function(data) {
        var myIp = data.ip || ''
    })

    chrome.storage.sync.get('toggleState', function(data) {
      var toggle = data.toggleState || false
    })

   chrome.storage.sync.get('toggle', function(data) {
     $('.toggle').attr('src',data.toggle);
   })

  $('.toggle').click(function(){
    var xhttp = new XMLHttpRequest();
      //chrome.storage.sync.get('toggle', function())
      var src = $(this).attr('src')
      var img = 'images/toggle_off_a.png'

      if (src.includes('off')){
        img = 'images/toggle_on_a.png'
        toggle = true
      }
      console.log(myIp)
      chrome.storage.sync.set({'toggleState': toggle})
      chrome.storage.sync.set({'ip': myIp})
      chrome.storage.sync.set({'toggle': img})
      $(this).attr('src', img)
    //   xhttp.open("GET", "http://localhost:3000/user/109.186.238.61", true)
    //   xhttp.send();

        xhttp.open("PUT", 'http://localhost:3000/update', true);
        xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhttp.send(JSON.stringify({ "ip": myIp, "status": toggle }));
  })

//   const userAction = async () => {
//     const response = await fetch('http://example.com/movies.json');
//     const myJson = await response.json(); //extract JSON from the http response
//     // do something with myJson
//   }

  let self = this
  $('.nav-link-img').click(function(){
    console.log('here');

    // //chrome.storage.sync.get('toggle', function())
    // var src = $(this).attr('src')
    // var img = 'images/toggle_off_a.png'
    // if (src.includes('off')){
    //   img = 'images/toggle_on_a.png'
    // }
    // chrome.storage.sync.set({'toggle': img})
    // $(this).attr('src', img)
    // let id = $(this).attr('id')
    // console.log(id);

    // if (id === 'nav1') {
    //     console.log('here2');

    //     $('.main_div').html(mainPage())
    // } else {
    //     $('.main_div').html(statisticPage())
    // }
    // getUserIP()
});
});


function mainPage() {
    return ` <div style="margin: 5px;" width="100%">
                <span class="text1">Enable Sharing</span>
                <img class="img-valign toggle" src="images/toggle_on_a.png"/>
            </div>

            <div class="center">
                <span> IP: </span>
                <span id="ip"></span>
            </div>
            <div class="main" >
                <iframe src="http://localhost:3000/api/test" frameBorder="0" style="width: 300px; height: 250px"></iframe>
            </div>
            <div class="total">
                <span> Total Revenue: </span>
                <span>  $15.70</span>
            </div>`
}

function statisticPage() {
    return `<h1>Statistic<h1>`
}
/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// function download() {
//     // var element = document.createElement('a');
//     console.log('here');

//     let element = document.querySelector('.file')
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('test gfgf'));
//     element.setAttribute('download', 'test.sh');
//     element.click();

//     if(document.body != null){
//         document.body.removeChild(element);
//     }
// }
// download()
getUserIP(function(ip){
    chrome.storage.sync.set({'ip': ip})
    myIp = ip
	//	document.getElementById("ip").innerHTML =  ip ;
});
