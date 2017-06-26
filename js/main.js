var Msgbox=function(id='msgbox',parent=document.body,debugid='msgboxDbg') {
//    'use strict';

    this.id=id;
    this.off=true;
    this.cbf=function(){};
    this.evtabort=null;
    this.evtok=null;
    this.evtin=null;
    this.tim=0;
    this.now=null;
    this.idt=null;
    this.tmo=null;
    this.trh=null;
    this.ref=document.createElement('div');
    this.par=parent;
    this.dbg=document.getElementById(debugid);
    this.mblg=null;
    this.mbin=null;
    this.mbab=null;
    this.mbok=null;
    this.mbtm=null;
    this.post=true;
    this.hf=false;

    init(this);

    function init(self) {
        self.ref.setAttribute('id',id);
        self.ref.setAttribute('class','msgbox disabled');
        self.ref.innerHTML='<div class="msgboxCell"><div class="msgboxObj"><div class="msgboxOut"></div><progress class="msgboxTim"></progress><input class="msgboxIn" type="text" placeholder="Input"><div class="msgboxCmd"><input class="msgboxAbort" type="button" value="Cancel"><input class="msgboxOK" type="button" value="OK"></div></div></div>';
        self.ref=self.par.appendChild(self.ref);
        self.mblg=self.ref.querySelector('.msgboxOut');
        self.mbin=self.ref.querySelector('.msgboxIn');
        self.mbab=self.ref.querySelector('.msgboxAbort');
        self.mbok=self.ref.querySelector('.msgboxOK');
        self.mbtm=self.ref.querySelector('.msgboxTim');
        self.ref.addEventListener('keypress',this.evtin=argcbf(keyget,self),true);
    }
    function show(self) {
        if (self.off) {
            var rc=/\s?\bdisabled\b/g;
            var c=self.ref.getAttribute('class');
            self.off=false;
            if (c.search(rc)!=-1) c=c.replace(rc,'');
            else c+=' disabled';
            self.ref.setAttribute('class',c);
        } else throw 'Error!\nMessage box already in use:\nClose it before another use...';
    }
    function hide(self) {
        self.ref.setAttribute('class','msgbox disabled');
    }
    this.hide=hide;
    function argcbf(f,...a) { return function(e) {
        // not proud of this solution, but seems working...
        // ( else having duplicate key event objects bug ^^ )
        if (a[0].toString()==e.toString()) a[0]=e;
        else a.unshift(e);
        f(...a);

    }; }

    this.html=function(f=null) {
        if (f===null) return this.hf;
        else this.hf=f;
    }

    this.append=function(f=null) {
        if (f===null) return this.post;
        else this.post=f;
    }

    this.callback=function(cbf=function(){}) {
        if (this.off) this.cbf=cbf;
        else {
            if (this.dbg!==null)
                this.dbg.innerHTML=cbf.toString().replace(/</g,'&lt;');
            throw 'Error!\nMessage box already in use:\nClose it before assigning new callback function...';
        }
    };
    function formatxt(self,msg) {
        return (self.hf)?msg:msg.replace(/</g,'&lt;').replace(/\n/g,'<br>');
    }
    function getnl(self) {
        return (self.hf)?'':'<br>';
    }
    this.log=function(msg='',delay=0) {
        var nl=getnl(this);
        msg=formatxt(this,msg);
        try {
            show(this);
            this.mblg.innerHTML=msg;
            this.mbin.style.display='none';
            this.mbab.style.display='none';
            this.mbok.addEventListener('click',this.evtok=argcbf(endlog,this),true);
            this.mbok.focus();
        }
        catch(e) { // not succeed to show means to update message
            if (this.post) this.mblg.innerHTML+=msg+nl;
            else this.mblg.innerHTML=msg+nl+this.mblg.innerHTML;
        }
        if (delay) {
            this.mbtm.style.visibility='visible';
            this.tim+=delay;
            this.mbtm.setAttribute('max',this.tim);
            if (!this.idt) this.mbtm.setAttribute('value',0);
            if (this.tim>100) {
                if (this.now===null) this.now=(new Date()).getTime();
                if (this.idt===null) {
                    this.tmo=true;
                    this.idt=window.setInterval(autoclose,20,this,endlog);
                }
            }
            else {
                cleartimer(self);
                this.idt=window.setTimeout(endlog,delay,this);
            }
        }
    };
    function cleartimer(self) {
        if (self.idt!==null)
            if (self.tmo)
                window.clearTimeout(self.idt);
            else
                window.clearInterval(self.idt);
            self.idt=null;
            self.tmo=false;
            self.now=null;
            self.tim=0;
    }
    function autoclose(self,cbf) {
        var val=(new Date()).getTime()-self.now;
        self.mbtm.setAttribute('value',val);
        if (self.tim<=val) {
            cleartimer(self);
            cbf(self);
        }
    }
    function endlog(evt,self) {
        // not proud of this too ( look at previous linked bug fix )
        if (self===undefined) self=evt;
        if (self.idt!==null) cleartimer(self);
        self.mbok.removeEventListener('click',self.evtok,true);
        self.ref.addEventListener('transitionend',self.trh=argcbf(transitionend,self),true);
        hide(self);
    }
    function transitionend(evt,self,val) {
        var cbf=self.cbf;
        self.off=true;
        self.ref.removeEventListener('transitionend',self.trh,true);
        /* reset msgbox */
        self.mbin.style.display='';
        self.mbin.value='';
        self.mblg.innerHTML='';
        self.mbab.style.display='';
        self.mbtm.style.visibility='';
        cbf(val);
    }
    this.get=function(msg='',placeholder='Input',deftext='') {
        msg=formatxt(this,msg);
        show(this);
        this.mblg.innerHTML=msg;
        this.mbin.value=deftext;
        this.mbin.setAttribute('placeholder',placeholder);
        this.mbab.addEventListener('click',this.evtabort=argcbf(endget,this,false),true);
        this.mbok.addEventListener('click',this.evtok=argcbf(endget,this,true),true);
        //this.mbin.addEventListener('keypress',this.evtin=argcbf(keyget,this),true);
        this.mbin.focus();
    };
    function keyget(evt,self) {
        if (evt.keyCode==13) {
            if ((evt.target==self.mbin)||(evt.target==self.mbok))
                self.mbok.click(evt,self,true);
            else if (evt.target==self.mbab)
                self.mbab.click(evt,self,true);
        }
    }
    function endget(evt,self,ok) {
        var val=null;
        if (ok) val=self.mbin.value;
        self.mbab.removeEventListener('click',self.evtabort,true);
        self.mbok.removeEventListener('click',self.evtok,true);
        //self.mbin.removeEventListener('keypress',self.evtin,true);
        self.ref.addEventListener('transitionend',self.trh=argcbf(transitionend,self,val),true);
        hide(self);
    }
    this.ask=function(msg='',placeholder='Input') {
        show(this);
        this.mblg.innerHTML=formatxt(this,msg);
        this.mbin.style.display='none';
        this.mbab.addEventListener('click',this.evtabort=argcbf(endask,this,false),true);
        this.mbok.addEventListener('click',this.evtok=argcbf(endask,this,true),true);
        this.mbok.focus();
    };
    function endask(evt,self,ok) {
        self.mbab.removeEventListener('click',self.evtabort,true);
        self.mbok.removeEventListener('click',self.evtok,true);
        self.ref.addEventListener('transitionend',self.trh=argcbf(transitionend,self,ok),true);
        hide(self);
    }
};

function mklist(id,title,...args) {
    var js="this.parentNode.parentNode.parentNode.nextSibling.nextSibling.value=(this.value);";
    var html=title+'<ol>';
    for (var i=0; i<args.length; i++)
        html+='<li><input type="radio" name="msgboxSel" value="'+(i+1)+'" onchange="'+js+'" id="'+id+i+'"><label for="'+id+i+'">'+args[i]+'</label></li>';
    return html+'<ul>';
}

/*====== the game ======*/

var hypnostrahl, enemychance, echoose, attack2C, attackchance;
var poisenyou, hpyou, hpenemy, ep, Item1a, Item2a, Item3a;
// adding 2 new var
var onplay=false; // flag to store game state
var mb; // instance of Msgbox object to replace alert/prompt/confirm

window.onload=function() { mb=new Msgbox(); }

function exit() { onplay=false; } // set the flag to false on exit

function play() {
    // start game only if not one already running
    if (onplay) {
        mb.callback(exit); // exit if a game is already running
        mb.log('A game is already running:\nPlease end it before starting a new...',5000);
    }
    onplay=true; // starting a game, set the flag to true
    // initialization
    hypnostrahl=undefined;
    enemychance = 0
    echoose=undefined;
    attack2C=undefined;
    attackchance=undefined;
    poisenyou=undefined;
    hpyou =100;
    hpenemy=undefined;
    ep = 150;
    Item1a = 1; // updated from last version
    Item2a = 3; // updated from last version
    Item3a = 2;
    //attackchance; // still defined
    start();
}
function start() {
    mb.callback(startswitch);
    mb.html(true);
    var html=mklist('msgboxOpt',
        'Choose dificulty',
        'Easy V1',
        'Normal V2',
        'Hard Alpha',
        'Hardcore Beta',
        'Ultra Hardcore Omega');
    mb.get(html);
    mb.html(false); // this could be deleted if always html use
}

function startswitch(choosemode) {
    if (choosemode===null) // test if user hit cancel button
        exit(); // if so exit...
    else {
        hpenemy=0;
        if (choosemode == 1)
            hpenemy = 100;
        if (choosemode == 2)
            hpenemy = 150;
        if (choosemode == 3)
            hpenemy = 200;
        if(choosemode==4)
            hpenemy= 250;
        if (choosemode==5)
            hpenemy=1000;
        if (hpenemy) {
            mb.callback(menu);
            mb.log("Megaman, Battle Routine, set, Execute!!!!!!!!!!!!!!!!!!!!!!!!!!!!",3000);
        }
        else {
            mb.callback(start);
            // updated from last version ( delete 'valid' )
            mb.log("Please choose a Gamemode!",3000);
        }
    }
}

function menu() {
    mb.callback(menuswitch);
    mb.html(true); // this could be deleted if always html use
    mb.get(mklist('msgboxOpt','Current HP = '+hpyou+'<br>Current EP = '+ep+'<br>Enemy HP = '+hpenemy,'Attack','Items','Pass','Exit'));
    // hpyou instead ep: you had corrected in last version ;)
    mb.html(false); // this could be deleted if always html use
}
function menuswitch(mainmenu) {
    if(mainmenu == 1)
        menu1();
    else if(mainmenu==2)
        menu2();
    else if (mainmenu==3) {
        hpyou += 15;
        ep += 30;
        mb.callback(enemyattack);
        mb.log("You recoverd 15HP and 30EP",5000);
    }
    else if ((mainmenu==4)||(mainmenu===null)) // test also if user cancel
        exit();
    else {
        mb.callback(menu);
        mb.log("Invalide number please choose 1 or 2!",3000);
    }
}

function menu1() {
    mb.callback(menu1switch);
    // updated from last version to show damage
    mb.html(true); // this could be deleted if always html use
//    mb.get(mklist('msgboxOpt','Current HP = '+hpyou+'<br>Current EP = '+ep+'Enemy HP = '+hpenemy,'Megabuster! EP cost = 35 | Damage = 40','Timpani! EP cost =  25 | Confuse enemy','Chargeshot EP cost = 75 | Damage 80','Minibomb EP cost = 5 | Damage = 10','Back'));
    // shortening EP/HP informations
    mb.get(mklist('msgboxOpt','Current HP = '+hpyou+'<br>Current EP = '+ep+'<br>Enemy HP = '+hpenemy,'Megabuster! <span style="font-size:0.66em;">35EP, Enemy HP-40</span>','Timpani! <span style="font-size:0.66em;">25EP, Confuse enemy</span>','Chargeshot <span style="font-size:0.66em;">75EP, Enemy HP-80</span>','Minibomb <span style="font-size:0.66em;">5EP, Enemy HP-10</span>','Back'));
    mb.html(false); // this could be deleted if always html use
}
function menu1switch(attack) {
    if (attack==1)
        attack1();
    else if (attack==2)
        attack2();
    else if (attack==3)
        attack3();
    else if (attack==4)
        attack4();
    else if ((attack==5)||(attack===null)) // test also if user cancel
        menu();
    else {
        mb.callback(menu1);
        mb.log("Invalide Number",3000);
    }
}

function menu2() {
    mb.callback(menu2switch);
    // mod' for showing quantity...
    //mb.get("1 = Subtank \n 2 = HP+30 \n 3 = EP Tank\n4 = Back");
    // + updated from last version to show HP/EP and modif' text
    mb.html(true); // this could be deleted if always html use
    mb.get(mklist('msgboxOpt','Current HP = '+hpyou+'<br>Current EP = '+hpyou,'Subtank Health <span style="font-size:0.66em;">50 HP ( '+Item1a+' )</span>','<span style="font-size:0.66em;">HP+30 ( '+Item2a+' )<span>','EP Tank Recover <span style="font-size:0.66em;">60 EP ( '+Item3a+' )</span>','Back'));
    mb.html(false); // this could be deleted if always html use
}
function menu2switch(ItemChoose) {
    if (ItemChoose==1)
        Item1();
    else if (ItemChoose==2)
        Item2();
    else if (ItemChoose==3)
        Item3();
    // bad syntax of var name ( 'itemchoose' ): corrected in last version ;)
    else if ((ItemChoose==4)||(ItemChoose===null)) // + if user cancel case
        menu();
    else {
        mb.callback(menu2);
        mb.log("Invalide number please choose 1, 2, 3 or 4!",3000);
    }
}


/*-------- from menu2: items --------*/

function Item1() {
    if (Item1a<=0) {
        mb.callback(menu2);
        mb.log("You used all your Subtanks",5000);
    }
    else {
        Item1a -= 1;
        hpyou += 30;
        mb.callback(enemyattack);
        mb.log("You recoverd 30HP. You now have "+hpyou+" HP",5000);
    }
}

function Item2() { // technically, what's the diff' between Item1 & Item2?
    if (Item2a<=0) {
        mb.callback(menu2);
        mb.log("You used all your HP +30",5000);
    }
    else {
        Item2a -= 1;
        hpyou += 30;
        mb.callback(enemyattack);
        mb.log("You recoverd 30HP. You now have "+hpyou+" HP",5000);
    }
}

function Item3() {
    if (Item3a == 0) { // comparison, not assignement: == instead =
        mb.callback(menu2);
        mb.log("You used all of you EP Tanks",5000);
    }
    else {
        ep += 60;
        Item3a -= 1;
        mb.callback(checkenemy);
        mb.log("You recoverd 60 EP",5000);
    }
}


/*-------- from menu1: attacks --------*/

function attack1() {
    if (ep<35) {
        mb.callback(menu1);
        mb.log("You dont have enough EP for Megabuster",5000);
    }
    else {
        mb.callback(checkenemy); // we can do it here for all 'else' cases
        attack1_1=Math.floor((Math.random()*200)+1);
        if (attack1_1>175) {
            ep-=35;
//            mb.callback(checkenemy);
            mb.log("Megabuster missed",5000);
        }
        else {
            attack1I=Math.floor((Math.random()*200)+1)
            if (attack1I>180) {
                hpenemy -= 60;
                ep -= 35;
//                mb.callback(checkenemy);
                mb.log("Critical hit with 60 Damage.\nEnemy now have "+hpenemy+"HP",5000);
            }
            else {
                hpenemy -= 40;
                ep -= 35;
//                mb.callback(checkenemy);
                mb.log("You hit Enemy with Megabuster. He took 40 Damage \nCurrent Enemy HP = "+hpenemy,5000);
            }
        }
    }
}

function attack2() {
    if (ep<20) {
        mb.callback(menu1);
        mb.log("You dont have enough EP for Timpani",5000);
    }
    else {
        mb.callback(checkenemy); // we can do it here for all 'else' cases
        ep -= 20;
        attack2I=Math.floor((Math.random()*200)+1);
        if (attack2I<100) {
//            mb.callback(checkenemy);
            mb.log("Timpani missed",3000);
        }
        else {
            enemychance += 2;
//            mb.callback(checkenemy);
            mb.log("Timpani confused Enemy",3000);
        }
    }
}

function attack3() {
    if (ep<75) {
        mb.callback(menu1);
        mb.log("You dont have enough EP for Chargeshot",3000);
    }
    else {
        mb.callback(checkenemy); // we can do it here for all 'else' cases
        attack3_1=Math.floor((Math.random()*200)+1);
        if (attack3_1>175) {
            ep-=75;
//            mb.callback(checkenemy);
            mb.log("Chargeshot missed",3000);
        }
        else {
            attack3I=Math.floor((Math.random()*200)+1);
            if (attack3I>180) {
                hpenemy -= 120;
                ep -= 75;
//                mb.callback(checkenemy);
                mb.log("Critical hit with 120 Damage!!\nEnemy now have "+hpenemy+"HP",5000);
            }
            else {
                hpenemy -= 80;
                ep -= 75;
//                mb.callback(checkenemy);
                mb.log("You hit Enemy with Chargeshot. He took 80 Damage \nCurrent Enemy HP = "+hpenemy,5000);
            }
        }
    }
}

function attack4() {
    if (ep<5) {
        mb.callback(menu1);
        mb.log("You dont have enough EP for Minibomb",3000);
    }
    else {
        mb.callback(checkenemy); // we can do it here for all 'else' cases
        ep-=5; // factorization...
        attack4_1=Math.floor((Math.random()*200)+1);
        if (attack4_1>175) {
            //ep-=5; // can be factorized outside if/else statement
//            mb.callback(checkenemy);
            mb.log("Minibomb missed",3000);
        }
        else {
            attack4I=Math.floor((Math.random()*200)+1);
            if (attack4I>180) {
                hpenemy -= 30;
                //ep-=5; // can be factorized outside if/else statement
//                mb.callback(checkenemy);
                mb.log("Critical hit with 30 Damage.\nEnemy now have "+hpenemy+"HP",5000);
            }
            else {
                hpenemy -= 10;
                //ep-=5; // can be factorized outside if/else statement
//                mb.callback(checkenemy);
                mb.log("You hit Enemy with Minibomb. He took 10 Damage \nCurrent Enemy HP = "+hpenemy,5000);
            }
        }
    }
}

function checkenemy() {
    if (hpenemy <= 0) {
        mb.callback(exit);
        mb.log("Enemy deleted!");
    }
    else enemyattack();
}

function enemyattack() {
   mb.callback(menu); // we can do it here for all cases
   if (enemychance > 0) {
       enemychance -= 1;
//       mb.callback(menu);
       mb.log("Enemy is confused and cannot attack",3000);
    }
    else {
        // updated from last version ( *4 instead *3 )
        echoose = Math.floor((Math.random()*4)+1);
        if (echoose == 1)
            attack1e();
        else if (echoose==2)
            attack2e();
        else if (echoose==3)
            attack3e();
        else if (echoose ==4)
            attack4e();
        else { // forgotten to go menu in this case
//            mb.callback(menu);
            mb.log("Enemy dont have attack",3000);
        }
    }
}

function attack1e() {
    mb.callback(attack1eswitch);
    mb.log("Enemy uses Hypnobeam",3000);
}
function attack1eswitch() {
    mb.callback(checkyou);
    hypnostrahl = Math.floor((Math.random()*4)+1);
    if(hypnostrahl==3){
        attackchance = 0;
//        mb.callback(checkyou);
        mb.log("You are confused",3000);
    }
    else {
//        mb.callback(checkyou);
        mb.log("Attack Hypnobeam has faild",3000);
    }
}

function attack2e() {
    mb.callback(attack2eswitch);
    mb.log("Enemy uses Firetornado",3000);
}
function attack2eswitch() {
    hpyou -= 50;
    mb.callback(checkyou);
    mb.log("You have "+hpyou+" Healthpoints",5000);
}

function attack3e() {
    hpyou -= 30;
    mb.callback(checkyou);
    mb.log("Enemy uses Firebreath \n You have "+hpyou+"Healthpoints ",5000);
}

function attack4e() {
    // updated from last version ( 2 instead 3 )
    poisenyou=2;
    mb.callback(checkyou);
    mb.log("Enemy uses Poisen",3000);
}

function checkyou() {
    if (hpyou <= 0) {
        mb.callback(exit);
        mb.log("Megaman deleted");
    }
    else
        menupoisen();
}

function menupoisen() {
    mb.callback(afterpoisen);
    if (poisenyou > 0) {
        hpyou -=10;
        // mix the 2 alert but possible to refactorize for have 2 pop-up box
        //alert ("The poisen hurted you");
        poisenyou -=1;
        //mb.callback(menu); // need another function for attackchance test:
        // I refactorize to correct behaviour ^^
//        mb.callback(afterpoisen);
        mb.log("The poisen hurted you\n\n"+"You have "+hpyou+" Healthpoints ",5000);
    }
    else if (poisenyou==0) {
        //mb.callback(menu); // need another function for attackchance test:
        // I refactorize to correct behaviour ^^
//        mb.callback(afterpoisen);
        mb.log("The poisen disapeard",3000);
    }
/*
    if (attackchance == 0) {      // need to be refactorized because
        attackchance = 1;         // previous options target menu()
        mb.callback(enemyattack); // and don't wish to execute that after
        mb.log("You cannot attack you are confused",3000); // exit() ^^
    }
    menu(); // else you may encounter bug of return to menu after exit() ^^
    // previous options gone to menu, but will return finish execute code
    // outside the if/else statement...
*/
    // and go to afterpoisen() only in others cases to prevent bug ;)
    else afterpoisen();
}

function afterpoisen() {
    if (attackchance == 0) {
        attackchance = 1;
        mb.callback(enemyattack);
        mb.log("You cannot attack you are confused",3000);
    }
    // only if not other option which go to menu() through ennemyattack()
    else menu();
}
