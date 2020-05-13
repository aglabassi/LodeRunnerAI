//Abdel Ghani Labassi et Yann Saah

var room = "thor";
var assert = require('assert');

//Fonctions auxilliaire de traitement de tableau et de records.

function contains(mat,tab){
    //Prend deux parametre, un tableau(de tableau), donc une matrice, et un tableau.
    //Retourne vrai si ce tableau est un element ligne de la matrice, faux sinon.

    for(var i=0; i<mat.length; i++){
    	//On parcour les lignes de la matrices

        if(""+mat[i] == tab) return true; //On convertit en string pour la comparaisont, avec l'operateur concatenation +
    }

    return false;
}

var testContains = function(){
	//Test de la fonction contains, qui teste les cas speciaux et les cas de base
 
	assert(contains([[]],[]));
	assert(!contains([],[]));
	assert(!contains([[]],[1]));
	assert(contains([[1]],[1]));
	assert(contains([[1,2,3],[1,2,4]], [1,2,4]));
	assert(!contains([[1,2,3],[1,2,4]], [1,2,6]));
}

function containsRec(tab,rec){
    //Prend deux parametre, un tableau d'enregistrement de la forme coord: Array, dist: number, et un enregistrement
    //de la meme forme
    //Retourne vrai si nouveau est element du tableau, faux sinon.(en comparant les coordonner)
 	
    for(var i=0; i<tab.length;i++){
    	//On parcour les element du tableau

        if(""+tab[i].coords == rec.coords){
        	//On a trouver un objet dans le tableau avec les meme coordonné que celui qu'on recherche 
            return true;
        }
    }

    return false; //on a pas trouvé 
}

function testContainsRec(){
	//Fonction qui test la fonction containsRec

	//On definit des enregistrement utiles pour nos tests.
	var rec = {coords:[1,2], dist: 5};
	var tab1 = [{coords:[1,2], dist: 84}];
	var tab2 = [{coords:[1,4], dist: 5}];
    
	assert(!containsRec([],rec));
	assert(containsRec(tab1,rec));
	assert(!containsRec(tab2,rec));
}

function remove(tab,x){
    //Retire un element nombre de tab si celui ci y est present, et Retourne un nouveau tableau
    //Si l'element est absent de tab, Retourne tab sans changement.
    //Si un element est present plusieurs fois dans tab, retirer les retire tous de tab
  
    if(tab.indexOf(x) == -1){
    	//L'element n'est pas dans le tableau
        return tab;   
    
    }else{
        var tabCopy = tab.slice(); //On cree une copie du tableau

        for(var i = 0; i<tab.length; i++){
        	//On parcour le tableau

            if(tab[i] == x){
            	//Lorsq'on trouve un element = x, on fait un splice pour l'enlever. Cette fonction
            	//enleve tous les x dans le tableau, pas uniquement que le premier.

                tabCopy.splice(tabCopy.indexOf(x),1);  
            } 
        }
    }

    return tabCopy;
}

function testRemove(){
	//on test la fonction remove, avec des cas interessant..

    assert(remove([9,1,2,4,5],2) == "9,1,4,5");//cas ou 2 est present une fois
    assert(remove([9,2,5,7],4) == "9,2,5,7"); 
    assert(remove([],3) == "");
    assert(remove([3],3) == "");
    assert(remove([5,1,7,5,15,5,5,5],5) == "1,7,15");
}

function cloneRec(rec){
	//Pour un type de records bien precis, contenant exacetement 2 clé, dont la forme est
	// coords: Array. dist: number.

    var recClone = {};
        recClone.coords = rec.coords.slice();
    	recClone.dist = rec.dist;
    
    return recClone;   
}

//On peut pas vraiment tester la fonction cloneRec avec ce qu'on a appris dans le cours....  

function transpose(mat){
	//Fonction prenant comme parametre une matrice 2d, et Retourne sa transposé,c-a-d
	//qu'elle prend les ieme element de chaque tableaux lignes et les met dans des tableaux discints
	//transformant ainsi les colonne de mat en lignes.
	
	if(""+mat == [[]]) return mat;

	var transpose = [];
	for(var i =0; i<mat[0].length; i++){ //Tous les tableau du tableau ont la meme grandeur	
		
		var t = [];
		for(var j =0; j<mat.length; j++){
			t.push(mat[j][i]);
			
		}

		transpose.push(t);
	
	}
	return transpose;
}

function testTranspose(){
	//On teste la fonction transpose

	assert(transpose([[]]) == ""+[[]]);
	assert(transpose([[3]]) == ""+[[3]]);
	assert(transpose([[1,2]]) == ""+[[1], [2]]);
	assert(transpose([[1,2,3],[4,5,6]]) == ""+[[1, 4], [2, 5], [3, 6]]);
}

/**
 * La fonction start() est appelée au début
 * d'un niveau et reçoit en paramètre la grille
 * initiale sous forme de chaîne de caractères
 *
 * Les symboles sont :
 *   # : brique
 *   & : position initiale du joueur
 *   $ : sac d'or
 *   H : échelle
 *   - : corde
 *   S : sortie
 *   espace vide : rien de spécial sur cette case
 */


//Variable globales

var path; //Variable global representant le chemin a suivre, changé par next() uniquement

var level; //Variable global level initialisé et inchanger apres que start est caller. 
//changer par start() uniquement, car demeure inchanger le long d'un niveau.

var round; //Variable global round, initialisé a -1 par start() et incrementer de 1 par next();

var coins; //variable global coins representant le nombre de jetons rammassé, modifier par next a
//chaque fois que le pos du runner est un $.

var coinsTotal; //variable global initialisé par start => total des jetons. Inchangé 

var caseCollected; //Tableau contenant les coordonnées des cellules ayant un lingot d'or dont on
//a deja recolté. initialiser a vide par start(), modifier par next.(/chaque fois que le pos du runner est un $.)


//Fonctions assurant l'implementation de l'IA

function start(map) {
	//Fonction appeleé au debut d'un niveau qui initialise level d'apres la chaine de caractere
	//map qu'elle recois par le serveur. (et affiche map au terminal), initialiser le compteur
	//global i a -1, initialise le nombre de jetons amassé coins a 0.
	
	coins = 0;
	round = -1; //Initialisation du compteur i (variable global) a -1  pour l'utiliser a next().
	level = mapInMat(map);
	coinsTotal = coinsCounter(level);
	caseCollected = [];

}

function mapInMat(map){
	//Fonction prennant comme parametre une chaine de caractere map, et la convertit en matrice 2d
	//On assume que map se termine  toujours par un /n, d'ou le pop plus loin.
	//On assume que map est de forme rectangulaire, c-a-dire convertissable en matrice 2D

	var matrice = map.split("\n").map(function(tab){
		return tab.split('');
	});

	matrice.pop(); //on enleve lelement vide du au dernier \n
	
	return transpose(matrice); //pour ecrire matrice[x][y] au lieu de  matrice[y][x], 
	//pour acceder a l'element de coordonné (x,y)

}

function testMapInMat(){

	assert(mapInMat("") == ""+ []);
	assert(mapInMat("\n") == ""+ [[]]);//On ne compte pas la derniere ligne
	assert(mapInMat(" \n") == ""+ [[" "]]);
	assert(mapInMat(" \n \n")== ""+ [[" ", " "]]);
	assert(mapInMat(" #\n #\n") == ""+ [[" ", " "], ["#", "#"]]);

}

function coinsCounter(lev){//lev pour pas confodre avec la variable global level
	//Prend comme parametre un niveau en forme de matrice, Retourne le nombre de lingot dor total
	
	var  res = 0;

	lev.forEach(function(ligns){

		ligns.forEach(function(char){

			if(char == "$") res++;
		
		});
	
	});

	return res;

} 

function testCoinsCounter(){
	//On teste la fonction coinsCounter

	assert(coinsCounter([[]]) == 0);
	assert(coinsCounter([[],[]]) == 0);
	assert(coinsCounter([["$"," "]]) == 1);
	assert(coinsCounter([["$"],[" "]]) == 1);
	assert(coinsCounter([["$"],["$"]]) == 2);
	assert(coinsCounter([["$","$"," "],[" ","$"]]) == 3);
}

function isAccessibleByFall(lev,x,y){
	//Prend comme parametre les cooddonné d'une case, et un niveau. Retourne vrai
	//si la case peut etre accéder par chute, faux sinon. On assume que les cases 
	//qu'on passe en parametre ne sont pas directement sur le sol  de #s.

	if(lev[x][y] == "#") return false;//On peut pas acceder a une brique

	//On cherche s'il y a une corde en haut du point (x,y)
	var i = 0;
	while( y-i >=0   &&   lev[x][y-i] != "-")   i++;

	if(y-i != -1) return true; //On a trouver une corde sur le point
	
	//On cherche si il y a des echelles a proximité..
	if( x!=0 && lev[x-1][y] == "H"){
		return true;
	
	}else if( x!=lev.length-1 && lev[x+1][y] == "H" ){
		return true;
	
	}else if( y == lev[x].length-1 ){
		return false; //On peut pas avoir d'element sous le dernier element
	
	}else{
		//on verife si la pos est un des coins de la derniere echelle
		//Si oui, alors pos est accessible
		if(x == 0) return lev[x+1][y+1] == "H"; 

		if(x == lev.length-1) return lev[x-1][y+1] == "H";
		
		else return ( (lev[x-1][y+1] == "H") ||
					 (lev[x+1][y+1] == "H") );
	}

}

function legitMovesOf(lev,x,y){
	//Prend comme parametre un niveau et une case identifier par des coordonné x et y, returne
	//le tableau de deplacement permis, si le joueur ne peut pas acceder a cette case (comme des 
	//espace trop haut ou des briques), alors on Retourne le charactere associé a la case (Brique...)

	var loc = lev[x][y]; //On laisse pas utiliser case car js lutilise pour autre chose
	var dep = loc; //Si inchanger, on Retourne le loc.

	
	if(loc == "-"){
		dep = [2,3,4]; //On ne peut pas aller en haut avec une corde
		
		if (lev[x][y+1] == "#"){
			dep = remove(dep,3); //on enleve la direction bas sil y a une brique.
		}

	}else if(loc == "H"){
		dep = [1,2,3,4]; 
		
		if (lev[x][y+1] == "#"){
			dep = remove(dep,3); //On enleve la direction bas sil y a une brique
		}
	
	}else if( (loc == " " ) || (loc == "$" ) || (loc == "&") || (loc == "S")) {
	
		if(lev[x][y+1] == "#"){
			//Si la case est un espace lingo, sortie ou joueur, il faut qu'elle est une brique en bas pour
			//quelle soit accessible. Sinon, elle ne peut etre accessible que par chute, et les movement
			//assosié a cela ne sont que bas.
			dep = [2,4];
		
		}else if(isAccessibleByFall(lev,x,y)){
			dep = [3];
		
		}else if(y!=lev[x].length-1 && lev[x][y+1] == "H"){
			dep = [2,3,4]; // case sur une echelle
		}
	
	}


	if(dep != loc ){
		//dep!= loc => que on a modifier dep => la position actuelle est accessible,
		//On suprime des mouvement si il y a des brique dans les environs.. 
		if(x ==0 || lev[x-1][y] == "#"){
			dep = remove(dep,2); //Le deplacement gauche est bloquer par un mur ou les bordure
		}

		if(x == lev.length -1 || lev[x+1][y] == "#"){
			dep = remove(dep,4); //Le deplacement droite est bloquer
		}
	}

	return dep;

}


function movesOn(lev){
	//Prend comme parametre la matrice level, returne une matrice de taille similaire avec les
	//element de lev remplacer par un tableau de deplacement permis si la case est accessible,
	//sinon on ne remplace pas

	var res = lev.map(function(tab){
		return tab.slice();
	}).slice();

	for(var i=0; i<lev.length; i++){

		for(var j=0; j<lev[i].length; j++){
			
			res[i][j] = legitMovesOf(lev,i,j);
		}

	}

	return res;

}

function voisins(loc,distI,lev){
	//distI represeante la distance de loc par raport a l'origine

	//Assume que loc est accessible
	//Prend comme parametre la position, le niveau et la distance entre l'origine et la position actuelle
	//Retourne les voisins sous forme d'enregistrement de la forme {dist: coords:} a partir des mouvement 
	//possible de movesOn(lev)

	var distF = distI +1;
	var x = loc[0]; var y = loc[1];
	var locMoves = movesOn(lev)[x][y];

	var vois = [];
	for(var i =0; i < locMoves.length; i++){

		if(locMoves[i] == 1){
			vois.push( {dist : distF,  coords: [x,y-1] } ); //On monte
		
		}else if(locMoves[i] == 2){
			vois.push( {dist : distF,  coords: [x-1 ,y] } );  //on bouge a gauche

		}else if(locMoves[i] == 3){
			vois.push( {dist : distF,  coords: [x,y+1] } ); //On descend
		
		}else if(locMoves[i]== 4){
			vois.push( {dist : distF,  coords: [x+1 ,y] } ); ///on bouge a droite
		}

	}

	return vois;
}



function caseIToCaseF(coordI,coordF,lev){
	//Assume que caseI et caseF (representer par leur coordonne) sont voisins (voisins n'inclue pas par les diagonales) 
	//(si il ne sont pas returne -1). Sinon  returne la direction pour aller de I => F
	
	x1 = coordI[0]; x2 = coordF[0];
	y1 = coordI[1]; y2 = coordF[1];


	if(x1 == x2 && y1 == y2) return 0; //on bouge pas pour aller de elle-meme a elle-meme

	if( (x2!= lev.length-1)
		&& (x1 == x2+1)
		&& (y1 == y2) )	return 2;
	

	if( (x2!= 0)
		&&  (x1 == x2-1)
		&& (y1 == y2) )	return 4;



	if( (y2!= lev[x1].length-1)
		&&  (y1 == y2+1)
		&& (x1 == x2 ) ) 	return 1;


	if( (y2!= 0) 
		&& (y1 == y2-1) 
		&& (x1 == x2) )	return 3;



	return -1; //aucun critere de voisinage verifier.

}


function interessante(loc, collectedCoinsCases, nCoins, nCoinsTot,lev){
	//Prend une case (coordonné), avec des parametre determinant l'etat actuelle de la partie
    //Retourne vrai si la case est interessante, faux sinon.
    //Une case interessante est un lingot non ramasse, ou bien tout simplement la sortie si tout les
    //lingots ont été ramassees.

	caseChar = lev[loc[0]][loc[1]];

	if(caseChar != "$" && caseChar != "S") return false;

	if(caseChar == "$" && !contains(collectedCoinsCases, loc)) return true;

	if(caseChar == "S" && nCoins == nCoinsTot ) return true;

	return false;

}

function breathSearch(origin, collectedCoinsCases, nCoins, nCoinsTot,lev){
	//prend comme parametre une case origine (determiné par next()), et des parametre determinant
	//l'etat de la partie, et Retourne une liste d'enregistrement de case visitedité avec leur enregistrement contenant
	//leur coordonnées et la distance relative a l'origine, pour arriver a une case interessante. 

	//note: le premier element de la liste est l'origine(avec distance = 0) et le dernier et la case d'interet
	//note: effectue une recherche en largeur.

	var caseVisited = {dist:0 , coords: origin};
	var visited = [caseVisited];
	var queue  = voisins(caseVisited.coords, caseVisited.dist, lev);

	while( !interessante(caseVisited.coords, collectedCoinsCases, nCoins, nCoinsTot, lev) ){

		caseVisited = queue.shift(); //Premier voisins determiner par voisins, premier a quitter queue.
		
		visited.push(caseVisited); //On ajoute la case visitediter a visited, On est sur que visited ne contains pas 
		//case car celle-ci provient de queue, qui refuse les case deja visitedité.

		var caseVois = voisins(caseVisited.coords, caseVisited.dist, lev); //On determine tous les voisins accessible de case
		
		var caseVoisClone = caseVois.slice().map(cloneRec);

		for(var i = 0; i<caseVoisClone.length; i++){

			if(containsRec(visited,caseVoisClone[i])){
			
				caseVois[i] = 1; //Juste 1 pour le supprimer par remove plus bas
			}
		}

		caseVois = remove(caseVois,1); //On retire tous les element de voisins qui etait dans visited

		queue = queue.concat(caseVois); //on concatene les voisins de la case actuellement visitedité avec queue, 
		///si les voisins netait pas dans visited.

	}


	return visited;

}

function findBestPath(origin, collectedCoinsCases, nCoins, nCoinsTot,lev){
	//pren comme parametre l'orginie et l'etat actuelle, Retourne une liste de directions
	//a prendre pour se rendre vers le prochain point d'interet.

	var visited = breathSearch(origin, collectedCoinsCases, nCoins, nCoinsTot,lev);	
	var directions = [];	
	var fin = visited.pop();
	
	for(var i = visited.length-1; i>=0; i--){

		direction = caseIToCaseF(visited[i].coords, fin.coords, lev);//sens inverse

		if((fin.dist -1 == visited[i].dist)   && (direction !=-1) ){
			
			directions.push(direction);
			fin = cloneRec(visited[i]);
		}

	
	}

	return directions;
	
}


// **
//  * La fonction `next` est appelée automatiquement à
//  * chaque round et doit Retourner un enregistrement
//  * de la forme :
//  *   {event: ..., direction: ...}
//  *
//  * Où : - event est un des deux événements "move", pour
//  *        se déplacer ou "dig" pour creuser
//  *      - direction est une des 4 directions haut/gauche/bas/droite,
//  *        représenté par un nombre : 1 pour haut, 2 pour gauche, ...
//  *
//  * Le paramètre `state` est un enregistrement contenant la position
//  * du runner au round actuel sous la forme :
//  *
//  *     {runner: {position: {x: ..., y: ...}}}
//  *

function next(state) {
	//Cette fonction est appelé a chaque nouvelle round. Celle ci a comme mandat de retourner ce que le runner doit
	//faire en 1 round (bouger d'une case a l'autre, ou creuser...) pour finir le niveau, d'apres notre IA.

	round++; //Compteur (variable global) initialisé a -1 lorsque start() est callé.
	var pos = [ state.runner.position.x, state.runner.position.y ];

	if( (level[pos[0]][pos[1]] == "$") && (!contains(caseCollected,pos)) )  {
		coins++;
		caseCollected.push(pos);
	
	}

	if(round == 0){

		path = findBestPath(pos, caseCollected, coins, coinsTotal ,level); //Breath searche de debut

	}else if(path.length == 0){

		path = findBestPath(pos, caseCollected, coins, coinsTotal ,level); //Breath search apres avoir trouver un lingot

	}

    return {event: "move", direction: path.pop()};
}

//Tests Unitaires
testContains();
testContainsRec();
testRemove();
testTranspose();
testMapInMat();
testCoinsCounter();


// XXX Important : ne pas modifier ces lignes
module.exports.room = room;
module.exports.start = start;
module.exports.next = next;
