var numberSoundBoxes=0;
var context=[];// = new AudioContext()
var o=[]; //= context.createOscillator()
var g=[];
var isRunning=[];

function init_soundBox(){
    context[numberSoundBoxes]=new AudioContext();
    o[numberSoundBoxes]=context[numberSoundBoxes].createOscillator();
    g[numberSoundBoxes]=context[numberSoundBoxes].createGain();
    isRunning[numberSoundBoxes]=false;
    var b = document.createElement('div');
    b.innerHTML=`	<div class="soundBox">
    <b> Rules</b>
    <textarea id="rules`+numberSoundBoxes+`">A=>BAA;\nB=>BBC;\nC=>AA;</textarea><br>
    <b> Sounds</b>
    <textarea id="sounds`+numberSoundBoxes+`">A:329.6;\nB:87.31;\nC:523.3;</textarea><br>
    <button onclick="process(`+numberSoundBoxes+`)">step</button>
    <button id="play`+numberSoundBoxes+`" onclick="play(`+numberSoundBoxes+`)">&#9654;</button>
    speed<input type="number" id="speed`+numberSoundBoxes+`" min="0.1" max="10" step="0.1" value="0.1">
    <input type="range" min="0" max="1" step="0.01" value="0.5" id="volume`+numberSoundBoxes+`" onchange="setVolume(`+numberSoundBoxes+`,this)">
    <select id="Otype`+numberSoundBoxes+`">
    <option value="sine">sine</option>
    <option value="square">square</option>
    <option value="sawtooth">sawtooth</option>
    <option value="triangle">triangle</option>
  </select>
  loop<input id="loopOn`+numberSoundBoxes+`" type="checkbox">
    <br>
    <textarea id="song`+numberSoundBoxes+`">A</textarea>
    </div>`;
    document.getElementById("workBench").append(b);
    numberSoundBoxes++;
}
function PlaySoundMap(id,song,soundMap,speed=0.1){
    o[id] = context[id].createOscillator()
    o[id].addEventListener('ended', event => {
        isRunning[id]=false;         
        if(document.getElementById("loopOn"+id).checked){
            play(id);
        }else{
            document.getElementById("play"+id).innerHTML="&#9654;";
        }
});
    g[id] = context[id].createGain()

    o[id].type = document.getElementById("Otype"+id).value;
    o[id].connect(g[id])
    g[id].connect(context[id].destination)
    o[id].start()
    var now = context[id].currentTime;
    notes = song.split("");

    notes.forEach(function callback(value, index) {
        o[id].frequency.setValueAtTime(soundMap[value],now+(index*speed))
    });
    o[id].stop(now + speed*notes.length);
}
function readRules(ruleSet){
    var ruleList=ruleSet.split(";");
    var ruleMap={};
    ruleList.forEach(element => {
        tupel=element.split("=>");
        if(tupel.length==2){
            ruleMap[tupel[0]]=tupel[1];
        }
    });
return ruleMap;
}
function readSounds(soundSet){
    var soundList=soundSet.split(";");
    var soundMap={};
    soundList.forEach(element => {
        tupel=element.split(":");
        if(tupel.length==2){
            soundMap[tupel[0]]=tupel[1];
        }
    });
return soundMap;
}

function proccessString(inp,ruleMap){
erg="";
inp.split("").forEach(i => {
    erg+=ruleMap[i];
});
return erg;
}


function process(id){
var r =readRules(document.getElementById("rules"+id).value.replace(/(\r\n|\n|\r|\s)/gm,''));
var erg= proccessString(document.getElementById("song"+id).value,r);
document.getElementById("song"+id).value=erg;
}
function play(id){
    
    if(isRunning[id]==true){
        document.getElementById("loopOn"+id).checked=false;
        o[id].stop();
        isRunning[id]=false
        document.getElementById("play"+id).innerHTML="&#9654;";
    }else{
        var s = readSounds(document.getElementById("sounds"+id).value.replace(/(\r\n|\n|\r|\s)/gm,''));
        var speed= document.getElementById("speed"+id).value;
        isRunning[id]=true;
        document.getElementById("play"+id).innerHTML="&#9209;";

        PlaySoundMap(id,document.getElementById("song"+id).value,s,speed);

    }
}
function stop(id){
o[id].stop();
o[id] = context[id].createOscillator();
}

function setVolume(id,node){
    g[id].gain.value=node.value;
}
function playAll(){
for(i=0; i< numberSoundBoxes; i++){
    play(i);
}
}
function stopAll(){
for(i=0; i< numberSoundBoxes; i++){
    stop(i);
}
}

