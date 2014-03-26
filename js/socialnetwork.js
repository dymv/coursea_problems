/*
  Social network connectivity. Given a social network containing N members and
  a log file containing M timestamps at which times pairs of members formed
  friendships, design an algorithm to determine the earliest time at which all
  members are connected (i.e., every member is a friend of a friend of ... of
  a friend). Assume that the log file is sorted by timestamp and that friendship
  is an equivalence relation. The running time of your algorithm should be MlogN
  or better and use extra space proportional to N.
*/

function SocialNetwork(){
  this.members = [];
  this.treeWeight = [];
  this.timestamps = [];
  this.unionRandMembers = [];
  
  this.outData = [];
  this.counterConnect = 0;
  
  this.elements = {
    members: null,
    times: null,
    tick: null,
    runButton: null,
    outBlock: null
  };
}

SocialNetwork.prototype.init = function(){
  var blockProblem = document.getElementById('socialNetwork');
  if (blockProblem) {
    this.elements.members = blockProblem
                              .querySelector('input[name="countMembers"]');
    this.elements.times = blockProblem
                            .querySelector('input[name="countTimes"]');
    this.elements.tick = blockProblem.querySelector('input[name="tickValue"]');
    this.elements.runButton = blockProblem.querySelector('button[name="run"]');
    this.elements.outBlock = blockProblem.getElementsByClassName('outBlock')[0];
    
    if (this.elements.members && this.elements.times &&
        this.elements.tick && this.elements.runButton &&
        this.elements.outBlock) {
      
      this.elements.runButton.addEventListener('mouseup', function(e){
        e.preventDefault();
        this._run();
      }.bind(this));
    }
  }
};

SocialNetwork.prototype._clearData = function(){
  this.outData = [];
  this.unionRandMembers = [];
  this.counterConnect = 0;
};

SocialNetwork.prototype._run = function(){
  this._clearData();
  
  if (this._getNewData()) {
    var time = -1;
    
    if (!this._allConnected()) {
      var startTime = this.timestamps[0];
      for (var i = 0, len = this.timestamps.length; i < len; i++) {
        this._randomUnion();
        if (this._allConnected()) {
          time = this.timestamps[i] - startTime;
          break;
        }
      }
    } else time = 0;
    
    if (time >= 0) this.outData.push('Steps >>> ' + this.counterConnect + ', ' +
                                      time + ' minutes');
    else this.outData.push('<<<< Not happened connection all members >>>>');
    
    this._out();
    
  } else this.outData.push('can\'t get data');
  
  this._out();
};

SocialNetwork.prototype._out = function(){
  this.elements.outBlock.innerHTML  = '<pre>' +
                                        this.outData.join("\n") +
                                      '</pre>';
  this.elements.outBlock.scrollTop = this.elements.outBlock.scrollHeight;
};

SocialNetwork.prototype._getNewData = function(cntM, times){
  return (this._createMembersArray(parseInt(this.elements.members.value)) &&
          this._createTimestampsArray(parseInt(this.elements.times.value),
                                      parseInt(this.elements.tick.value)));
};

SocialNetwork.prototype._createMembersArray = function(num){
  if (num > 0) {
    this.members = [];
    for (var i = 0; i < num; i++) {
      this.members[i] = i;
      this.treeWeight[i] = 1;
    }
    return true;
  } else return false;
};

SocialNetwork.prototype._createTimestampsArray = function(num, tick){
  if (num > 0 && tick > 0) {
    this.timestamps = [];
    for (var i = 0, val = tick; i < num; i++, val += tick) {
      this.timestamps[i] = val;
    }
    return true;
  } else return false;
};

SocialNetwork.prototype._isConnected = function(a, b){
  return this._getRoot(a) === this._getRoot(b);
};

SocialNetwork.prototype._getRoot = function(a){
  if (this.members.length <= a) return -1;
  
  while(this.members[a] !== a) {
    a = this.members[a];
  }
  return a;
};

SocialNetwork.prototype._unionMembers = function(a, b){
  this.outData.push(++this.counterConnect + ' connect: ' + a + ', ' + b);
  if (!this._isConnected(a, b)) {
    var aRoot = this._getRoot(a),
        bRoot = this._getRoot(b),
        tmp;
    
    if (this.treeWeight[aRoot] < this.treeWeight[bRoot]) {
      b = a;
      tmp = bRoot;
      bRoot = aRoot;
      aRoot = tmp;
    }
    
    this.treeWeight[aRoot] += this.treeWeight[bRoot];
    
    while(this.members[b] !== b) {
      tmp = b;
      b = this.members[b];
      this.members[tmp] = this.members[aRoot];
    }
    this.members[b] = this.members[aRoot];
    
    // out info
    this.outData.push('members: ' + JSON.stringify(this.members));
    this.outData.push('weight: ' + JSON.stringify(this.treeWeight));
  } else {
    this.outData.push('already connected');
  }
  
  this.outData.push('=========');
};

SocialNetwork.prototype._allConnected = function(){
  if (this.members.length > 0) {
    for (var i = 0, len = this.members.length - 1; i < len; i++) {
      for (var j = i + 1; j <= len; j++) {
        if (!this._isConnected(this.members[i], this.members[j])) return false;
      }
    }
    return true;
  } else return false;
};

SocialNetwork.prototype._getRandomMember = function(){
  return Math.floor(Math.random() * (this.members.length));
};

SocialNetwork.prototype._randomUnion = function(){
  var randOne, randTwo;
  do {
    randOne = this._getRandomMember();
    randTwo = this._getRandomMember();
  } while(randOne === randTwo ||
          this.unionRandMembers.indexOf([randOne, randTwo].toString()) !== -1);
  
  this.unionRandMembers.push([randOne, randTwo].toString());
  this.unionRandMembers.push([randTwo, randOne].toString());
  
  this._unionMembers(randOne, randTwo);
};

var socialNetwork = new SocialNetwork();

socialNetwork.init();