var hypnostrahl
var enemychance = 0
var echoose;
var attack2C
var attackchance
var poisenyou
var hpyou =100
var hpenemy
var ep = 150
var Item1a = 1
var Item2a = 3
var Item3a = 2
var attackchance
kit()
function kit (){
    var kit = prompt("Select a Kit\n1 = Standard Kit\n2 = Tank Kit\n3 = Offense Kit\n4 = EP Kit")
    if (kit == 1){
        start()
    }
    else if(kit == 2){
        hpyou=200
        ep -=30
        item3a-=-1
        start()
    }
    else if(kit == 3){

    }
}
function start (){
    var choosemode = prompt("Choose dificulty\n 1 = Easy V1\n 2 = Normal V2\n 3 = Hard Alpha\n 4 = Hardcore Beta\n 5 = Ultra Hardcore Omega")
    if(choosemode == 1){
        hpenemy = 100
    }
    else if(choosemode == 2){
        hpenemy = 150
    }
    else if(choosemode == 3){
        hpenemy = 200
    }
    else if(choosemode==4){
        hpenemy= 250
    }
    else if (choosemode==5){
        hpenemy=1000
    }
    else {
        alert("Plaese choose a Gamemode!")
        start()
    }
   alert("Megaman, Battle Routine, set, Execute!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
}


menu();
function menupoisen(){
    if (poisenyou > 0){
        hpyou -=10
        alert ("The poisen hurted you")
        poisenyou -=1
        alert("You have "+hpyou+" Healthpoints ")
        menu()
    }
    else if (poisenyou==0){
        alert("The poisen disapeard")
        menu()
    }
    if(attackchance == 0){
       alert("You cannot attack you are confused")
       attackchance = 1
       enemyattack()
    }
    menu()
}
function menu(){
    var mainmenu = prompt ("Current HP = "+hpyou+"\nCurrent EP = "+ep+"\nEnemy HP = "+hpenemy+"\n1 = Attack\n2 = Items\n3 = Pass\n4 = Exit ");
    if(mainmenu == 1){
        menu1();
    }
    else if(mainmenu==2){
        menu2();
    }

    else if (mainmenu==3){
        hpyou += 15;
        ep += 30;
        alert("You recoverd 15HP and 30EP");
        enemyattack();
    }
    else if (mainmenu==4){
        exit();
    }
    else{
        alert ("Invalide number please choose 1 or 2!");
        menu();
    }
}
function menu1(){

    var attack = prompt("Current HP = "+hpyou+"\nCurrent EP= "+ep+" \nEnemy HP = "+hpenemy+"\n1 = Megabuster! EP cost = 35 | Damage = 40\n 2 = Timpani! EP cost =  25 | Confuse enemy\n 3 = Chargeshot EP cost = 75 | Damage = 80\n 4 = Minibomb EP cost = 5 | Damage = 10\n 5 = Back");
    if (attack==1){
        attack1();
    }
    else if(attack==2){
        attack2();
    }
    else if(attack==3){
        attack3();
    }
    else if(attack==4){
        attack4();
    }
    else if(attack==5){
        menu();
    }
    else{
        alert("Invalide Number");
        menu1();
    }
}
function menu2(){
    var ItemChoose = prompt("Current HP = "+hpyou+"\nCurrent EP= "+ep+"\n1 = Subtank Heals 50 HP\n 2 = HP+30 \n 3 = EP Tank Recovers 60 EP\n4 = Back")

    if(ItemChoose==1){
        Item1()
    }

    else if (ItemChoose==2){
        Item2()
    }

    else if (ItemChoose==3){
        Item3()
    }
    else if (ItemChoose==4){
        menu()
    }
    else {
        alert ("Invalide number please choose 1, 2, 3 or 4!")
        menu2()
    }
}


function Item1(){

     if(Item1a<=0){
            alert("You used all your Subtanks")
            menu2()
     }
     else{
         Item1a -= 1
            hpyou += 50
            alert("You recoverd 30HP. You now have "+hpyou+" HP")
             enemyattack ()
     }
}
function Item2(){

     if(Item2a<=0){
            alert("You used all your HP +30")
            menu2()
     }
     else{
         Item2a -= 1
            hpyou += 30
            alert("You recoverd 30HP. You now have "+hpyou+" HP")
            enemyattack ()
     }
}
function Item3(){
    if(Item3a <= 0){
        alert ("You used all of you EP Tanks")
        menu2()
    }
    else{
    ep += 60
    Item3a -= 1
    alert("You recoverd 60 EP")
    checkenemy()
}
}


function attack1(){
     if(ep<35){
                alert("You dont have enough EP for Megabuster")
                menu1()
        }
        else{
            attack1_1=Math.floor((Math.random()*200)+1)
        if(attack1_1>175){
            ep-=35
            alert("Megabuster missed")
            checkenemy()
}
    else{
            attack1I=Math.floor((Math.random()*200)+1)
            if(attack1I>180){
                hpenemy -= 60
                ep -= 35
                alert("Critical hit with 60 Damage.\nEnemy now have "+hpenemy+"HP")
                checkenemy()
            }
        else{
            hpenemy -= 40
            ep -= 35
            alert ("You hit Enemy with Megabuster. He took 40 Damage \nCurrent Enemy HP = "+hpenemy)
            checkenemy()
        }
    }
    }
}
function attack2(){
    if(ep<20){
        alert("You dont have enough EP for Timpani")
        menu1()
    }
    else{
        ep -= 20
        attack2I=Math.floor((Math.random()*200)+1)
        if(attack2I<100){
            alert("Timpani missed")
            checkenemy()
        }
        else{
            enemychance += 2
            alert("Timpani confused Enemy")
            checkenemy()
        }

    }

}
function attack3(){
    if(ep<75){
        alert("You dont have enough EP for Chargeshot")
        menu1()
    }
    else{
            attack3_1=Math.floor((Math.random()*200)+1)
        if(attack3_1>175){
        ep-=75
        alert("Chargeshot missed")
        checkenemy()
}
    else{
        attack3I=Math.floor((Math.random()*200)+1)
    if (attack3I>180){
        hpenemy -= 120
        ep -= 75
        alert("Critical hit with 120 Damage!!\nEnemy now have "+hpenemy+"HP")
        checkenemy()

    }
    else{
        hpenemy -= 80
        ep -= 75
        alert ("You hit Enemy with Chargeshot. He took 80 Damage \nCurrent Enemy HP = "+hpenemy)
        checkenemy()
    }
    }
}
}
function attack4(){
    if(ep<5){
                alert("You dont have enough EP for Minibomb")
                menu1()
        }
        else{
            attack4_1=Math.floor((Math.random()*200)+1)
        if(attack4_1>175){
        ep-=5
        alert("Minibomb missed")
        checkenemy()
}
    else{
            attack4I=Math.floor((Math.random()*200)+1)
            if(attack4I>180){
                hpenemy -= 30
                ep -= 5
                alert("Critical hit with 30 Damage.\nEnemy now have "+hpenemy+"HP")
                checkenemy()
            }
        else{
            hpenemy -= 10
            ep -= 5
            alert ("You hit Enemy with Minibomb. He took 10 Damage \nCurrent Enemy HP = "+hpenemy)
            checkenemy()
        }
    }
    }
}


function enemyattack(){
if(enemychance > 0){
   alert ("Enemy is confused and cannot attack")
   enemychance -= 1
   menu()
}
else{
   echoose = Math.floor((Math.random()*4)+1)
   if (echoose == 1){
      attack1e()
   }
   else if(echoose==2){
      attack2e()
   }
   else if (echoose==3){
       attack3e ()
   }
   else if(echoose ==4){
      attack4e()
   }
   else{
      alert("Enemy dont have attack")
   }
}
}
function attack1e(){
    alert("Enemy uses Hypnobeam")
   hypnostrahl = Math.floor((Math.random()*4)+1)
   if(hypnostrahl==3){
       attackchance = 0
       alert("You are confused")
   }
   else{
      alert("Attack Hypnobeam has faild")
   }
   checkyou()
}
function attack2e(){
   alert ("Enemy uses Firetornado")
   hpyou -= 50
   alert("You have "+hpyou+" Healthpoints")
   checkyou()
}
function attack3e(){
   hpyou -= 30
   alert("Enemy uses Firebreath \n You have "+hpyou+"Healthpoints ")
   checkyou()
}
function attack4e(){
   alert("Enemy uses Poisen")
   poisenyou=2
   checkyou()
}

function checkyou(){
   if (hpyou <= 0) {
      alert ("Megaman deleted")
        exit()
   }
   else{
      menupoisen()
   }
}
function exit(){
   exit()
}
function checkenemy(){
   if(hpenemy <= 0) {
      alert("Enemy deleted!")
      exit()
   }
   else{
       enemyattack ()
   }
}




function exit(){

}
