/* Mouad Belbey
** Van Nam Vu
** Date : 08/03/2020

Programme sert a generer un labyrinthe par hasard
de taille (largeur, hauteur, pas).

Pour le fonction labySol (Pledge), on a mis en commentaire.
Il faut enlever les // pour l'activer 
*/

var grille = []; //tableau des numeros cellules
var grid = []; // tableau des cellules avec coordonnees
var mursH = []; //tableau de murs H dans Labyrinthe
var mursV = []; //tableau de murs V dans Labyrinthe

var cave = []; // tableau de cellule dans cavite
var front = []; // tableau de voisin des cellules dans cavite
var cellRandom; // variable pour la prochaine cellule par hasard
var cellActuel; // variable indique la cellule actuelle

var x; //Coordonne x de cellule
var y; //Coordonne y de cellule
var N; //Mur Nord de cellule
var E; //Mur Est de cellule
var S; //Mur Sud de cellule
var O; //Mur Ouest de cellule

//variable pour la Pledge
var sum; // somme +1 quand robot tourne gauche et 
		 // -1 quand robot tourne droite

/*Cette procedure cree un labyrinthe aleatoire 
 (largeur=nx et hauteur=ny) et dessine ce labyrinthe au centre
 de la fenetre de dessin en utilisant une grille avec des cellules 
 de (pas) pixels de largeur et hauteur.
 Parametre :
 - largeur : largeur de labyrinthe
 - hauteur : hauteur de labyrinthe
 - pas : longueur d'une cellule
 */
var laby = function (largeur, hauteur, pas){
   
    mursH = iota(largeur*(hauteur+1));
    mursV = iota(hauteur*(largeur+1));
    setupGrid(largeur,hauteur);
    setupGrille(largeur,hauteur);
	
    //random 1er cave
    cave = [grille[Math.floor(Math.random()*largeur*hauteur)]];
    
    do {
		currentCell(cave,grid,largeur,hauteur);
       
		nextCell(cave,grid,largeur,hauteur);//cell random
       
        ajoutCave(cave,grid,cellActuel,cellRandom,largeur);
       
        front = retirer(front,cellRandom);

    } while (cave.length != grille.length);

    dessineLaby(largeur,hauteur,pas);

};

/* Fonction qui genere un  tableau contenant 
   la numerotation des  cellules de labyrinthe
Parametre :
- largeur : largeur de labyrinthe
- hauteur : hauteur de labyrinthe
*/
var setupGrille = function (largeur,hauteur){
    for (var i = 0;i < hauteur*largeur; i++){
		grille.push(i);
    }
	return grille;
};

/* Fonction qui genere un  tableau contenant 
   les coordonnes (x,y) des  cellules de labyrinthe
Parametre :
- largeur : largeur de labyrinthe
- hauteur : hauteur de labyrinthe
*/
var setupGrid = function (largeur,hauteur){
    for (var j = 0;j < hauteur; j++){
    	for (var i = 0; i< largeur; i++){
            grid.push(cell(i,j));
        }
    }
	return grid;
};

/* Sous-fonction de setupGri qui genere un  tableau 
contenant les coordonnes (x,y) d'une cellule de labyrinthe
Parametre :
- x : coordonnee x de cellule
- y : coordonnee y de cellule
*/
var cell = function (x,y){
	var cell = {x : x,y : y};
    
    cell.x = x;
    cell.y = y;
    
    return cell;
};

/* Fonction sert a definir la cellule actuelle, 
les voisins et les ajouter dand tableau Front
Parametre :
- cave : tableau de cellule dans labyrinthe
- grid : tableau des coordonnes des cellules
- largeur : largeur de labyrinthe
- hauteur : hauteur de labyrinthe
*/
var currentCell = function (cave, grid, largeur, hauteur){
    var tab2 = [];
	cellActuel = (cave[cave.length-1]);
   
    tab2 = voisins(grid[cave[cave.length-1]].x,grid[cave[cave.length-1]].y,
                 largeur, hauteur);
   
    for(var p = 0; p<tab2.length;p++){
        if (contient(cave,tab2[p]) == 0){
    		ajouter(front,tab2[p]);
        }
    }
    return front;
    return cellActuel;
};

/* Fonction sert a choisir aleatoirement le voisin
Parametre :
- cave : tableau de cellule dans labyrinthe
- grid : tableau des coordonnes des cellules
- largeur : largeur de labyrinthe
- hauteur : hauteur de labyrinthe
*/
var nextCell = function (cave,grid,largeur, hauteur){
	var tab = []; //Pour stocker les voisins de cellule actuelle
    
    var tab1 = []; // Dans le cas les valeurs dans 
    			   // tab sont contenues dans cave
   
    tab = voisins(grid[cave[cave.length-1]].x,grid[cave[cave.length-1]].y,
                 largeur, hauteur);
    
	if(tab.length >1){
        
        if (compareTable(cave,tab) == 0){ 
            
    		randomCell(cave,tab);
            return cellRandom;
        }
        
        //quand les valeurs dans tab sont contenues dans cave
        if (compareTable(cave,tab) == 1){
           
            for (var i = 0; i < cave.length;i++){
            	cellActuel = cave[cave.length-2-i];
           
            	tab1 = voisins(grid[cellActuel].x,grid[cellActuel].y,
							largeur, hauteur);
           
            	if ( compareTable(cave,tab1) == 0){
        			randomCell(cave,tab1);
            		return cellRandom;
            	}
        	}
    	}
    }
    return cellRandom = front[0];
};

/* Sous-fonction pour comparer 2 tableau
Parametre :
- tab1 : 1er tableau a comparer
- tab2 : 2er tableau a comparer
*/
var compareTable = function (tab1,tab2){
   
    candidat:
	for (var i = 0; i<tab2.length; i++){
    	if (contient(tab1,tab2[i]) == 1){
        	continue candidat;
    	}
        return false;
	}
    return true;
};

/* Sous-fonction pour choisir random prochain cellule
Parametre :
- cave : tableau de cellule dans labyrinthe
- tab : tableau de voisin de cellule actuelle
*/
var randomCell = function (cave,tab){
    do {
    	cellRandom = tab[Math.floor(Math.random()*tab.length)];
    } while (contient(cave,cellRandom) == 1);
   
    return cellRandom;
};

/* Fonction ajoute la cellule selectionne et elimine mur
Parametre :
- cave : tableau de cellule dans labyrinthe
- grid : tableau des coordonnes des cellules
- cellActuel : cellule actuelle
- cellRandom : cellule voisine selectionne
- largeur : largeur de labyrinthe
*/
var ajoutCave = function (cave,grid,cellActuel,cellRandom,largeur){
   
    calculMurCell(grid,cellActuel,largeur);
   
	ajouter(cave,cellRandom);
   
	//eliminer mur
    if (cellActuel - cellRandom == 1) {
        mursV = retirer(mursV,O);
        
    } else if (cellActuel - cellRandom == -1) {
    	mursV = retirer(mursV,E);
        
    } else if (cellActuel - cellRandom == largeur){
    	mursH = retirer(mursH,N);
        
    } else if (cellActuel - cellRandom == -largeur) {
    	mursH = retirer(mursH,S);
    }
    
    return cave;
    return mursH;
    return mursV;
};

/* Fonction calcule les murs N,E,S,O de la cellule
Parametre :
- grid : tableau des coordonnes des cellules
- cellActuel : cellule actuelle
- largeur : largeur de labyrinthe
*/
var calculMurCell = function (grid,cellActuel,largeur){
   
    x = grid[cellActuel].x;// coordonne x
    y = grid[cellActuel].y;// coordonne y
   
    N = x + y * largeur;
    E = 1 + x + y * (largeur + 1);
    S = x + (y + 1) * largeur;
    O = x + y * (largeur + 1);
   
};

/* Fonction pour dessiner labyrinthe
Parametre :
- largeur : largeur de labyrinthe
- hauteur : hautereur de labyrinthe
- pas : longueur d'une cellule
*/
var dessineLaby = function(largeur,hauteur,pas) {
    var Ox = largeur*pas/2; //Coordonnes x de point de depart
    var Oy = hauteur*pas/2; //Coordonnes y de point de depart
    
    debutTortue(Ox,Oy);
    
    //dessiner les murs horizontaux
    for (var i = 0; i <= hauteur; i++){
        var murH = i*largeur;
        
        for (var j = 0; j < largeur;j++){
                   
    		if (murH == mursH[0]
           		|| contient(mursH,murH) == 0 ){
        		pu();
            	fd(pas);
            	pd();
        	} else if(murH == mursH[mursH.length-1]){
            	pu();
            	fd(pas);
            	pd();
            	break;    
        	} else if (contient(mursH,murH) == 1) {
        		fd(pas);
        	}
			murH += 1;
        }  
        pu();
        mv(-(Ox),Oy-(i+1)*pas);
        pd();
    }

	debutTortue(Ox,Oy);
    
    //dessiner les murs verticaux
    for (var i = 0; i <= largeur; i++){
        var mur = i;
        
		for (var j = 0; j < hauteur;j++){
        	if (contient(mursV,mur) == 1) {
            	fd(pas);
               
            } else if (contient(mursV,mur) == 0){
                pu();
            	fd(pas);
            	pd();
            }
            mur = mur + (largeur+1);
        }
        pu();
        mv(-(Ox)+(i+1)*pas,Oy);
        pd();
    }
 
};

/* Fonction pour deplacer le tortue au point
de depart
Parametre :
- x : Coordonne x du point de depart
- y : Coordonne y du point de depart
*/
var debutTortue = function (x,y){
	pu();
    mv(-(x),y);
    rt(90);
    pd();
};

/* Fonction genere un tableau de longueur n
avec les valeurs de 0 a n-1 inclusivement
Parametre :
- n : longueur du tableau
*/
var iota = function (n) {
    var tab = [];
    
    for (var i = 0; i<n;i++){
    	tab.push(i);
    }
    return tab;
};

/* Fonction qui detecte si une valeur est
deja dans le tableau
Parametre :
- tab : tableau a comparer
- x : valeur a comparer
*/
var contient = function (tab, x){
	for (var k = 0; k < tab.length;k++){
    	if (tab[k] == x){
        	return true;
        }
    }
    return false;
};

/* Fonction qui ajouet une valeur si 
elle n'est pas dans le tableau
Parametre :
- tab : tableau a comparer
- x : valeur a ajouter
*/
var ajouter = function(tab, x){
    if (contient(tab,x) == true){
    	return tab;
    }
    tab.push(x);
    return tab;
};

/* Fonction qui retire une valeur si 
elle est deja dans le tableau
Parametre :
- tab : tableau a comparer
- x : valeur a retirer
*/
var retirer = function(tab, x){
	var tab1 = [];

	for (var i=0; i<tab.length; i++){
        if (tab[i] != x){
        tab1.push(tab[i]);
		}
	}
	tab = tab1;
	return tab;
};

/* Fonction qui definit les voisins d'une cellule
Parametre :
- x : Coordonne x de la cellule
- y : Coordonne y de la cellule
- largeur : largeur de labyrinthe
- hauteur : hauteur de labyrinthe
*/
var voisins = function(x, y, largeur, hauteur){
    var N = x + y * largeur;
    var tab = [];
   
    if (x==0 && y==0) {
       
        tab.push(N+1);
        tab.push(N+largeur);
        return tab;
   
    } else if (x==(largeur-1) && y==0){
       
        tab.push(N-1);
        tab.push(N+largeur);
        return tab;
   
    } else if (x==(largeur-1) && y==(hauteur-1)){
     
        tab.push(N-largeur);
        tab.push(N-1);
        return tab;
   
    } else if (x==0 && y==(hauteur-1)){
   
        tab.push(N-largeur);
        tab.push(N+1);
        return tab;
   
    } else if ((x>0 || x<(largeur-1)) && y==0){
   
        tab.push(N-1);
        tab.push(N+1);
        tab.push(N+largeur);
        return tab;
   
    } else if ((x>0 || x<(largeur-1)) && y==(hauteur-1)){
             
        tab.push(N-largeur);
        tab.push(N-1);
        tab.push(N+1);
        return tab;
   
    } else if (x==0 && (y>0 || y<(hauteur-1))){
       
        tab.push(N-largeur);
        tab.push(N+1);
        tab.push(N+largeur);
        return tab;
   
    } else if (x==(largeur-1) && (y>0 || y<(hauteur-1))){
       
        tab.push(N-largeur);
        tab.push(N-1);
        tab.push(N+largeur);
        return tab;
   
    } else if ((x>0 || x<(largeur-1)) && (y>0 || y==(hauteur-1))){
       
        tab.push(N-largeur);
        tab.push(N-1);
        tab.push(N+1);
        tab.push(N+largeur);
        return tab;
	}
};


var test = function() {
	assert(iota(5) == '0,1,2,3,4' );
    assert(iota(1) == '0');
    assert(contient ([18,35,47], 35) == true);
    assert(contient ([5,14,6,34], 4) == false);
    assert(contient ([], 4) == false);
    assert(ajouter ([], 2) == '2');
    assert(ajouter ([9,2,5], 2) == '9,2,5');
    assert(ajouter ([15,30,5], 4) == '15,30,5,4');
    assert(retirer ([9,2,7,14],7 ) == '9,2,14');
    assert(retirer ([9,2,5], 4) == '9,2,5');
    assert(retirer ([], 4) == '');
    assert(voisins (7,2,8,4) == '15,22,31');
    assert(voisins (4,1,8,4) == '4,11,13,20');
};

test();
laby(10,9,20);

/*************** Solution Labyrinthe ***************
On utilise les tableaux Grilles, mursH et mursV pour
resoudre labyrinthe de taille (largeur, hauteur,pas) 
Parametre 
- largeur : largeur de Labyrinthe
- hauteur : hauteur de Labyrinthe
- pas : longueur d'une cellule
*/
var labySol = function (largeur, hauteur, pas){

    debutTortue(largeur*pas/2-pas/2,hauteur*pas/2);
    lt(90);
    setpc(1,0,0);
    fd(pas/2);
    
    cellActuel = 0;
    
    var tab = []; //tableau contient les cell que robot passe

    tab.push(cellActuel);
    sum = 0;

    pledge:
    while ( tab[tab.length-1] != grille[grille.length-1]){
        cellActuel = tab[tab.length-1];

        if (sum == 0){
        	etape1Pledge(tab,cellActuel,largeur,pas);
		} else if (sum != 0) {
        	etape2Pledge(tab,cellActuel,largeur,pas);
        }

    }
    
    cellActuel = tab[tab.length-1];
   
    if (cellActuel - tab[tab.length-2] == largeur){
    	fd(pas);
    } else if (cellActuel - tab[tab.length-2] == 1){
    	rt(90);
        fd(pas);
    }
};

/* Fonction qui execute 1er etape de Pledge
Parametre :
- tab : tableau des cellules que robot a passe
- cellActuel : cellule actuelle (position robot)
- largeur : largeur de labyrinthe
- pas : longueur d'une pas de robot
*/
var etape1Pledge = function (tab,cellActuel,largeur,pas){
    calculMurCell(grid,cellActuel,largeur);
   
    if (cellActuel == 0 || cellActuel - tab[tab.length-2] == largeur){ //1er cas
        
        	while (contient(mursH,S)==0){

    			fd(pas);
        		cellActuel += largeur;
        		calculMurCell(grid,cellActuel,largeur);
        		tab.push(cellActuel);
    		}
        	if (contient(mursH,S) == 1 && contient(mursV,O)== 1
            	&& contient(mursV,E) == 1) {
            
        		lt(90);
            	lt(90);
            	fd(pas);
            	cellActuel -= largeur;
            	tab.push(cellActuel);
            	sum += 2;

        	} else if (contient(mursH,S) == 1){
            
        		lt(90);
            	sum += 1;
            
            	if (contient(mursV,E) == 1) {
                
            		lt(90);
                	fd(pas);
                	sum += 1;
                	cellActuel -= largeur;
                	tab.push(cellActuel);
                	return;
            	}
            	fd(pas);
            	cellActuel += 1;
            	tab.push(cellActuel);
        	}
    } else if (cellActuel - tab[tab.length-2] == -largeur){ // 2e cas
		
        	while (contient(mursH,N)==0){
                
    			fd(pas);
        		cellActuel -= largeur;
        		calculMurCell(grid,cellActuel,largeur);
        		tab.push(cellActuel);
    		}
        	if (contient(mursH,N) == 1 && contient(mursV,O)== 1
            	&& contient(mursV,E) == 1) {
            
        		lt(90);
            	lt(90);
            	fd(pas);
            	cellActuel -= largeur;
            	tab.push(cellActuel);
            	sum += 2;
           
        	} else if (contient(mursH,N) == 1){
        		lt(90);
            	sum += 1;

            	if (contient(mursV,O) == 1) {

            		lt(90);
                	fd(pas);
                	sum += 1;
                	cellActuel += largeur;
                	tab.push(cellActuel);
                	return;
            	}
            	fd(pas);
            	cellActuel -= 1;
            	tab.push(cellActuel);
			}
    }  else if (cellActuel - tab[tab.length-2] == 1){ //3e cas
           
			while (contient(mursV,E)==0){
    			fd(pas);
        		cellActuel += 1;
        		calculMurCell(grid,cellActuel,largeur);
        		tab.push(cellActuel);
    		} 
        	if (contient(mursH,N) == 1 && contient(mursH,S)== 1
         		&& contient(mursV,E) == 1) {
            
        		lt(90);
            	lt(90);
            	fd(pas);
            	cellActuel -= largeur;
            	tab.push(cellActuel);
            	sum += 2;
 
        	} else if (contient(mursV,E) == 1){
        		lt(90);
            	sum += 1;

            	if (contient(mursH,N) == 1) {
                
            		lt(90);
                	fd(pas);
                	sum += 1;
                	cellActuel -= 1;
                	tab.push(cellActuel);
                	return;
            	}
            	fd(pas);
            	cellActuel -= largeur;
            	tab.push(cellActuel);

        	}
    }  else if (cellActuel - tab[tab.length-2] == -1){ //4e cas
       
			while (contient(mursV,O)==0){
    			fd(pas);
        		cellActuel -= 1;
        		calculMurCell(grid,cellActuel,largeur);
        		tab.push(cellActuel);
    		}
           
        	if (contient(mursH,N) == 1 && contient(mursV,O)== 1
            	&& contient(mursH,S) == 1) {
            
        		lt(90);
            	lt(90);
            	fd(pas);
            	cellActuel -= largeur;
            	tab.push(cellActuel);
            	sum += 2;
  
        	} else if (contient(mursV,O) == 1){           
        		lt(90);
            	sum += 1;
            
            	if (contient(mursH,S) == 1) {
            		lt(90);
                	fd(pas);
                	sum += 1;
                	cellActuel += 1;
                	tab.push(cellActuel);
                	return;
                    
            	}
            	fd(pas);
            	cellActuel += largeur;
            	tab.push(cellActuel);
        	}
	}
    
    return sum;
};

/* Fonction qui execute 2e etape de Pledge
Parametre :
- tab : tableau des cellules que robot a passe
- cellActuel : cellule actuelle (position robot)
- largeur : largeur de labyrinthe
- pas : longueur d'une pas de robot
*/
var etape2Pledge = function (tab,cellActuel,largeur,pas){
	
    calculMurCell(grid,cellActuel,largeur);
   
    if (cellActuel - tab[tab.length-2] == largeur){ //1er cas
    	if (contient(mursH,S) == 0
         && contient(mursV,O) == 1){
            
        	fd(pas);
            cellActuel += largeur;
            tab.push(cellActuel);
            return;
            
        } else if (contient(mursV,O) == 0){
            
            rt(90);
        	fd(pas);
            sum -= 1;
            cellActuel -= 1;
            tab.push(cellActuel);
            return sum;
            
        } else if (contient(mursH,S) == 1
            && contient(mursV,O) == 1
            && contient(mursV,E) == 0){

            lt(90);
        	fd(pas);
            sum +=1;
            cellActuel += 1;
            tab.push(cellActuel);
            return sum;
            
        } else if (contient(mursH,S) == 1
            && contient(mursV,O) == 1
            && contient(mursV,E) == 1){
            
            lt(90);
            lt(90);
        	fd(pas);
            cellActuel -= largeur;
            tab.push(cellActuel);
            sum +=2;
            return sum;
        }
    } else if (cellActuel - tab[tab.length-2] == -largeur){ // 2e cas
		if (contient(mursH,N) == 0
         && contient(mursV,E) == 1){
            
        	fd(pas);
            cellActuel -= largeur;
            tab.push(cellActuel);
            return;
            
        } else if (contient(mursV,E) == 0){
            
            rt(90);
        	fd(pas);
            sum -= 1;
            cellActuel += 1 ;
            tab.push(cellActuel);
            return sum;
            
        } else if (contient(mursH,N) == 1
            	&& contient(mursV,E) == 1
            	&& contient(mursV,O) == 0){
                
            	lt(90);
        		fd(pas);
            	sum +=1;
            	cellActuel -= 1;
            	tab.push(cellActuel);
            	return sum;
                
        } else if (contient(mursH,N) == 1
            	&& contient(mursV,O) == 1
            	&& contient(mursV,E) == 1){
                
            	lt(90);
            	lt(90);
        		fd(pas);
            	cellActuel += largeur;
            	tab.push(cellActuel);
            	sum +=2;
            	return sum;
        }
	} else if (cellActuel - tab[tab.length-2] == 1){ // 3e cas
    	if (contient(mursV,E) == 0
         && contient(mursH,S) == 1){
                    
        		fd(pas);
            	cellActuel += 1;
            	tab.push(cellActuel);
            	return;
                    
        } else if (contient(mursH,S) == 0){
                    
            	rt(90);
        		fd(pas);
            	sum -= 1;
            	cellActuel += largeur ;
            	tab.push(cellActuel);
            	return sum;
                    
        } else if (contient(mursV,E) == 1
            	&& contient(mursH,S) == 1
            	&& contient(mursH,N) == 0){
                    
            	lt(90);
        		fd(pas);
            	sum +=1;
            	cellActuel -= largeur;
            	tab.push(cellActuel);
            	return sum;
            
        } else if (contient(mursH,S) == 1
            	&& contient(mursH,N) == 1
            	&& contient(mursV,E) == 1){
                    
            	lt(90);
            	lt(90);
        		fd(pas);
            	cellActuel -= 1;
            	tab.push(cellActuel);
            	sum +=2;
            	return sum;
        }
	} else if (cellActuel - tab[tab.length-2] == -1){ // 4e cas
    	if (contient(mursV,O) == 0
         && contient(mursH,N) == 1){
            
        		fd(pas);
            	cellActuel -= 1;
            	tab.push(cellActuel);
            	return;
            
        } else if (contient(mursH,N) == 0){
            
            	rt(90);
        		fd(pas);
            	sum -= 1;
            	cellActuel -= largeur ;
            	tab.push(cellActuel);
            	return sum;
            
        } else if (contient(mursV,O) == 1
            	&& contient(mursH,N) == 1
            	&& contient(mursH,S) == 0){
            
            	lt(90);
        		fd(pas);
            	sum +=1;
            	cellActuel += largeur;
            	tab.push(cellActuel);
            	return sum;
            
        } else if (contient(mursH,S) == 1
            	&& contient(mursV,O) == 1
            	&& contient(mursH,N) == 1){
            
            	lt(90);
            	lt(90);
        		fd(pas);
            	cellActuel += 1;
            	tab.push(cellActuel);
            	sum +=2;
            	return sum;
		}
	}
};

labySol(10,9,20);

