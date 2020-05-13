//Abdel Ghani Labassi et Yann Saah

var assert = require('assert');

function genererTable(width, height) {
    //Genere une table (string en html5) de dimension widthxheight, contenant les id appropripé
    //Prend comme parametre la hauteur et la largeur souhaité, en comptant a partir de 0

    var res = '<table id="table">';

    for(var y=0; y<height; y++){
        //On fait une premiere boucle pour parcourir les indice allant de 0 jusqua la largeur -1
        res+= '<tr>';

        for(var x =0; x<width; x++){
            //On fait une deuzieme boucle pour parcourir les indices allant de 0 jusqu'a la hauteur -1
           
            res+= '<td id="'+ y+'-'+x + '"></td>';

        }

        res+= '</tr>';

    }

    return res+'</table>';

}

function testGenererTable(){
    //On test la fonction genererTable avec des cas de base  pour s'assurer que ce qu'elle fait
    //correspond a nos attentes

    assert(genererTable(0,0) == "<table id=\"table\"></table>");
    assert(genererTable(1,0)== "<table id=\"table\"></table>");
    assert(genererTable(0,1) == "<table id=\"table\"><tr></tr></table>");
    assert(genererTable(1,1) == "<table id=\"table\"><tr><td id=\"0-0\"></td></tr></table>");
    assert(genererTable(2,1) == "<table id=\"table\"><tr><td id=\"0-0\"></td><td id=\"0-1\"></td></tr></table>");
    assert(genererTable(1,2) == "<table id=\"table\"><tr><td id=\"0-0\"></td></tr><tr><td id=\"1-0\"></td></tr></table>");
    assert(genererTable(2,2) == "<table id=\"table\"><tr><td id=\"0-0\"></td><td id=\"0-1\"></td>"+
                                "</tr><tr><td id=\"1-0\"></td><td id=\"1-1\"></td></tr></table>");
}

function mapInMat(map){
    //Fonction prennant comme parametre une chaine de caractere map, et la convertit en matrice 2d.
    //Les lignes de la chaine map, separé par un \n, seront les ligne de la matrice, et chacuns des caracteres
    //contenut dans chaques lignes sera separer en tableau. Ainsi nous aurons une matrice contenant
    //chaque charactere de map.


    var matrice = map.split("\n").map(function(tab){
        return tab.split('');
    });

    matrice.pop(); //on enleve lelement vide du au dernier \n
 
    return matrice;  //Ici, on ne transpose pas car on veut plutot ecrire matrice[y][x]
    //pour acceder a l'element de coordonné (x,y)
}

//Deja testé

function draw(map) {
    //Cette procedure prend comme parametre un niveau sous sa forme de chaine, le convertit en matrice, puis effectue
    //les operations necessaires pour faire passer une image specifique au backgroud d'une cellule de la table HTML,
    //dependamment du caractère. (# represente un mur, ...)
 
    var lev = mapInMat(map);
    var container = document.getElementById('grid');
    var height = lev.length;
    var width = lev[0].length;

    var table = genererTable(width, height);

    container.innerHTML = table;

    for(var y=0; y<height; y++) {

        for(var x=0; x<width; x++) {
           //Cette boucle imbriquee dans l'autre nous permet de parcourir chaque element (charactere) du niveau en question
           //On met comme image de background l'image approprié, dependamment du charactere actuelle.

            var char = lev[y][x];
           
            if(char == "#") char = "%23";


            var img = 'url("img/'+ char  + '.png';


            document.getElementById(y + '-' + x).style.backgroundImage = img;
        }
    }

}

//Test Unitaire
testGenererTable();
