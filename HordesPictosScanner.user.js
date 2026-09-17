// ==UserScript==
// @name         Hordes Pictos Scanner
// @description  Ce script permet de scanner n'importe quelle âme pour y récupérer les valeurs de pictos choisis.
// @icon         https://myhordes.fr/build/images/emotes/exploration.3c1e616f.gif
// @namespace    http://tampermonkey.net/
// @version      0.8
// @author       Eliam
// @match        https://myhordes.fr/*
// @match        https://myhordes.de/*
// @match        https://myhordes.eu/*
// @match        https://myhord.es/*
// @updateURL    https://github.com/Croaaa/HordesPictosScanner/raw/main/HordesPictosScanner.user.js
// @downloadURL  https://github.com/Croaaa/HordesPictosScanner/raw/main/HordesPictosScanner.user.js
// @grant        none
// ==/UserScript==


(function() {

    'use strict';

    // *************************************************************************************************** //
    // Définitions des couleurs et des données statiques (couleurs, pictoData)                             //
    // *************************************************************************************************** //

    // Contient les couleurs utilisées dans le style du script.
    const colors = {
        mediumBrown: '#7E4D2A',
        darkBrown: '#3b1807',
        lightGold: '#f0d79e',
        white: '#ffffff',
        black: '#000000',
        coralRed: '#f44336',
        rareGold: '#ffe96c',
        commonBrown: '#5C2B20',
    };

    // Contient les URLs des icônes qui n'en ont pas par défaut.
    const specialPictoUrls = {
        'r_thermal': `https://gitlab.com/eternaltwin/myhordes/myhordes/-/raw/master/assets/img/icons/title/r_thermal.gif`,
        'r_cburn': `https://myhordes.fr/build/images/pictos/r_cburn.5fa2e830.gif`
    };

    // Contient les données de chaque picto avec leurs propriétés (id, nom, rareté, catégorie).
    const pictoData = [
        // Morts
        { id: 'r_dcity', name: 'Morts dans votre lit', rare: false, category: 'Morts' },
        { id: 'r_doutsd', name: 'Nuits dans le désert', rare: false, category: 'Morts' },
        { id: 'r_dhang', name: 'Pendaisons', rare: false, category: 'Morts' },
        { id: 'r_dwater', name: 'Morts par Déshydratation', rare: false, category: 'Morts' },
        { id: 'r_ddrug', name: 'Morts par Manque', rare: false, category: 'Morts' },
        { id: 'r_dinfec', name: 'Mort par infection', rare: true, category: 'Morts' },
        { id: 'r_surgrp', name: 'Dernière ligne', rare: true, category: 'Morts' },
        { id: 'r_surlst', name: 'Mort Ultime', rare: true, category: 'Morts' },
        { id: 'r_suhard', name: 'Mort Ultime du Pandémonium !', rare: true, category: 'Morts' },

        // Métiers
        { id: 'r_jcolle', name: 'Fouineur', rare: false, category: 'Métiers' },
        { id: 'r_jrangr', name: 'Éclaireur', rare: false, category: 'Métiers' },
        { id: 'r_jermit', name: 'Ermite', rare: false, category: 'Métiers' },
        { id: 'r_jguard', name: 'Gardien', rare: false, category: 'Métiers' },
        { id: 'r_jtech', name: 'Technicien', rare: false, category: 'Métiers' },
        { id: 'r_jtamer', name: 'Apprivoiseur', rare: false, category: 'Métiers' },
        { id: 'r_jsham', name: 'Chaman', rare: false, category: 'Métiers' },
        { id: 'r_jbasic', name: 'Habitant', rare: false, category: 'Métiers' },

        // Merveilles
        { id: 'r_wondrs', name: 'Projets insensés', rare: false, category: 'Merveilles' },
        { id: 'r_ebuild', name: 'Construction de Merveilles', rare: true, category: 'Merveilles' },
        { id: 'r_dnucl', name: 'Mort par l\'atome', rare: true, category: 'Merveilles' },
        { id: 'r_ebcstl', name: 'Merveille : Château de sable', rare: true, category: 'Merveilles' },
        { id: 'r_ebpmv', name: 'Merveille : PMV géant', rare: true, category: 'Merveilles' },
        { id: 'r_ebgros', name: 'Merveille : Roue de Grostas', rare: true, category: 'Merveilles' },
        { id: 'r_ebcrow', name: 'Merveille : Statue du Corbeau', rare: true, category: 'Merveilles' },
        { id: 'r_thermal', name: 'Merveille : Thermes de l\'Or bleu', rare: true, category: 'Merveilles' },

        // Ville
        { id: 'r_buildr', name: 'Chantiers', rare: false, category: 'Ville' },
        { id: 'r_refine', name: 'Artisanat', rare: false, category: 'Ville' },
        { id: 'r_brep', name: 'Réparations de chantiers', rare: false, category: 'Ville' },
        { id: 'r_guard', name: 'Veilleur', rare: false, category: 'Ville' },
        { id: 'r_cgarb', name: 'Sorteur', rare: false, category: 'Ville' },
        { id: 'r_cwater', name: 'Arroseur', rare: false, category: 'Ville' },
        { id: 'r_cburn', name: 'Crémateur de corps', rare: false, category: 'Ville' },
        { id: 'r_cooked', name: 'Cuisine exotique', rare: false, category: 'Ville' },

        // Maison
        { id: 'r_homeup', name: 'Améliorations de maison', rare: false, category: 'Maison' },
        { id: 'r_hbuild', name: 'Travaux chez soi', rare: false, category: 'Maison' },
        { id: 'r_cookr', name: 'Bons ptits plats', rare: false, category: 'Maison' },
        { id: 'r_drgmkr', name: 'Laborantin', rare: false, category: 'Maison' },
        { id: 'r_deco', name: 'Décoration', rare: false, category: 'Maison' },
        { id: 'r_theft', name: 'Larcins', rare: false, category: 'Maison' },
        { id: 'r_plundr', name: 'Pillages de maison', rare: false, category: 'Maison' },

        // Désert
        { id: 'r_digger', name: 'Déblaiement', rare: false, category: 'Désert' },
        { id: 'r_explor', name: 'Explorations avancées', rare: false, category: 'Désert' },
        { id: 'r_explo2', name: 'Explorations très lointaines', rare: true, category: 'Désert' },
        { id: 'r_ruine', name: 'Exploration de ruine', rare: false, category: 'Désert' },
        { id: 'r_door', name: 'Ouverture de porte', rare: true, category: 'Désert' },
        { id: 'r_camp', name: 'Campeur téméraire', rare: false, category: 'Désert' },
        { id: 'r_cmplst', name: 'Campeur de l\'au-delà', rare: true, category: 'Désert' },

        // Paria
        { id: 'r_ban', name: 'Bannissements', rare: false, category: 'Paria' },
        { id: 'r_solban', name: 'Banni émancipé', rare: false, category: 'Paria' },
        { id: 'r_cannib', name: 'Cannibalisme', rare: false, category: 'Paria' },
        { id: 'r_wound', name: 'Blessures', rare: false, category: 'Paria' },
        { id: 'r_drug', name: 'Drogues', rare: false, category: 'Paria' },
        { id: 'r_cobaye', name: 'Expérimentations', rare: false, category: 'Paria' },
        { id: 'r_alcool', name: 'Alcools', rare: false, category: 'Paria' },

        // Pictophilie
        { id: 'r_watgun', name: 'Canons à eau', rare: true, category: 'Pictophilie' },
        { id: 'r_batgun', name: 'Super lance-piles', rare: true, category: 'Pictophilie' },
        { id: 'r_tronco', name: 'Tronçonneuses', rare: true, category: 'Pictophilie' },
        { id: 'r_chstxl', name: 'Chanceux', rare: true, category: 'Pictophilie' },
        { id: 'r_rp', name: 'Rôliste', rare: true, category: 'Pictophilie' },

        // Âmes
        { id: 'r_collec', name: 'Purificateur d\'âmes', rare: false, category: 'Âmes' },
        { id: 'r_collec2', name: 'Collecteur d\'âmes', rare: false, category: 'Âmes' },
        { id: 'r_mystic', name: 'Mysticisme', rare: false, category: 'Âmes' },
        { id: 'r_mystic2', name: 'Transformation mystique', rare: false, category: 'Âmes' },
        { id: 'r_ptame', name: 'Valeur de l\'âme', rare: false, category: 'Âmes' },

        // Évènementiel
        { id: 'r_lepre', name: 'Le lutin vous a bien eu', rare: true, category: 'Évènementiel' },
        { id: 'r_santac', name: 'Le Père Noël est une ordure', rare: true, category: 'Évènementiel' },
        { id: 'r_sandb', name: 'Boules de sable !', rare: true, category: 'Évènementiel' },
        { id: 'r_paques', name: 'Crucifixion', rare: true, category: 'Évènementiel' },
        { id: 'r_bgum', name: 'Médailles communautaires', rare: true, category: 'Évènementiel' },

        // Divers
        { id: 'r_heroac', name: 'Actions héroïques', rare: true, category: 'Divers' },
        { id: 'r_killz', name: 'Zombies éliminés', rare: false, category: 'Divers' },
        { id: 'r_wrestl', name: 'Combats désespérés', rare: false, category: 'Divers' },
        { id: 'r_animal', name: 'Boucherie', rare: false, category: 'Divers' },
        { id: 'r_broken', name: 'Maladresses', rare: false, category: 'Divers' },
        { id: 'r_repair', name: 'Réparations', rare: false, category: 'Divers' },
        { id: 'r_pande', name: 'Survivant de l\'enfer !', rare: true, category: 'Divers' },
        { id: 'r_nodrug', name: 'Clair(e)', rare: false, category: 'Divers' },
        { id: 'r_guide', name: 'Guide Spirituel', rare: false, category: 'Divers' },
        { id: 'r_share', name: 'Générosité', rare: false, category: 'Divers' },
        { id: 'r_maso', name: 'Masochisme', rare: false, category: 'Divers' },
        { id: 'r_forum', name: 'Messages', rare: false, category: 'Divers' },
    ];



    // *************************************************************************************************** //
    // Fonctions utilitaires (extraction des informations sur le joueur, gestion des pictos)               //
    // *************************************************************************************************** //

    // Fonction pour extraire l'ID et le nom du joueur.
    function getPlayerInfo() {
        const distinctionsElement = document.querySelector('hordes-distinctions');
        const playerId = distinctionsElement ? distinctionsElement.getAttribute('data-user') : null;

        // Le nom du joueur est récupéré comme avant
        const usernameElement = document.querySelector('.soul-name .username');
        const playerName = usernameElement ? usernameElement.textContent.trim() : null;

        return { playerId, playerName };
    }


    // Fonction pour sauvegarder l'état des pictos et des catégories dans localStorage.
    function saveSettings() {
        const pictoStates = {};
        const categoryStates = {};

        document.querySelectorAll('.picto-button').forEach(picto => {
            const opacity = picto.style.opacity || '1';
            pictoStates[picto.title] = opacity;
        });

        document.querySelectorAll('.category-title').forEach(categoryElement => {
            const categoryName = categoryElement.innerText;
            const pictos = document.querySelectorAll(`.picto-button[data-category="${categoryName}"]`);
            const allDeselected = Array.from(pictos).every(picto => picto.style.opacity === '0.15');

            categoryElement.style.opacity = allDeselected ? '0.15' : '1';
            categoryStates[categoryName] = categoryElement.style.opacity;
        });

        const stateToSave = { pictoStates, categoryStates };
        localStorage.setItem('pictosState', JSON.stringify(stateToSave));
    }

    // Fonction pour charger l'état des pictos et des catégories depuis localStorage.
    function loadSettings() {
        const savedState = JSON.parse(localStorage.getItem('pictosState')) || { pictoStates: {}, categoryStates: {} };

        document.querySelectorAll('.picto-button').forEach(picto => {
            const opacity = savedState.pictoStates[picto.title];
            if (opacity) {
                picto.style.opacity = opacity;
            }
        });

        document.querySelectorAll('.category-title').forEach(category => {
            const opacity = savedState.categoryStates[category.innerText];
            if (opacity) {
                category.style.opacity = opacity;
            }
        });

        // Ajout de la logique pour gérer la sélection automatique des catégories.
        document.querySelectorAll('.category-title').forEach(category => {
            const categoryName = category.innerText;
            const categoryPictos = document.querySelectorAll(`.picto-button[data-category="${categoryName}"]`);
            const allSelected = Array.from(categoryPictos).every(picto => picto.style.opacity === '1');
            const noneSelected = Array.from(categoryPictos).every(picto => picto.style.opacity === '0.15');

            if (allSelected) {
                category.style.opacity = '1';
            } else if (noneSelected) {
                category.style.opacity = '0.15';
            } else {
                category.style.opacity = savedState.categoryStates[categoryName] || '1';
            }
        });
    }

    // Fonction pour extraire les données des pictos de la page.
    function getData() {
        const savedState = JSON.parse(localStorage.getItem('pictosState')) || { pictoStates: {} };
        const selectedPictos = [];

        document.querySelectorAll('.distinctions .picto').forEach(pictoElement => {
            const imgSrc = pictoElement.querySelector('img').src;
            const pictoIdMatch = imgSrc.match(/\/pictos\/(r_[^.]+)\./);
            const pictoId = pictoIdMatch ? pictoIdMatch[1] : null;

            if (pictoId) {
                const pictoName = pictoData.find(p => p.id === pictoId)?.name;
                const opacity = savedState.pictoStates[pictoName];

                if (opacity === '1') {
                    const valueElements = pictoElement.querySelectorAll('.counter .count');
                    const value = Array.from(valueElements).map(el => el.getAttribute('data-num')).join('');
                    selectedPictos.push({ pictoId: pictoId, value: value || '0' });
                }
            }
        });

        return selectedPictos;
    }

    // Fonction pour stocker les données des pictos en fonction de l'ID du joueur.
    function saveData(playerId, playerName) {
        const existingData = JSON.parse(localStorage.getItem('resultsData')) || {};
        const pictosData = getData();
        existingData[playerId] = { playerName, pictosData };
        localStorage.setItem('resultsData', JSON.stringify(existingData));
    }



    // *************************************************************************************************** //
    // Fonctions de création des éléments d'interface (boutons, catégories, fenêtres)                      //
    // *************************************************************************************************** //

    // Crée un bouton de picto individuel avec son style, son icône, et ses interactions.
    function createPictoButton(picto) {
        const pictoButton = document.createElement('div');
        pictoButton.className = 'picto-button';
        pictoButton.style.display = 'inline-block';
        pictoButton.style.width = '30px';
        pictoButton.style.height = '30px';
        pictoButton.style.padding = '5px';
        pictoButton.style.margin = '2px';
        pictoButton.style.border = `2px solid ${picto.rare ? colors.rareGold : colors.darkBrown}`;
        pictoButton.style.borderRadius = '5px';
        pictoButton.style.textAlign = 'center';
        pictoButton.style.cursor = 'pointer';
        pictoButton.title = picto.name;

        const pictoImage = document.createElement('img');
        pictoImage.src = specialPictoUrls[picto.id] || `https://gitlab.com/eternaltwin/myhordes/myhordes/-/raw/master/assets/img/pictos/${picto.id}.gif`;
        pictoImage.alt = picto.name;
        pictoImage.style.display = 'block';
        pictoImage.style.margin = '0 auto';
        pictoImage.style.width = '100%';

        pictoButton.appendChild(pictoImage);

        const savedState = JSON.parse(localStorage.getItem('pictosState')) || { pictoStates: {}, categoryStates: {} };
        if (savedState.pictoStates[picto.name]) {
            pictoButton.style.opacity = savedState.pictoStates[picto.name];
        }

        pictoButton.addEventListener('mouseover', () => {
            pictoButton.style.borderColor = colors.lightGold;
        });

        pictoButton.addEventListener('mouseout', () => {
            pictoButton.style.borderColor = picto.rare ? colors.rareGold : colors.darkBrown;
        });

        pictoButton.addEventListener('click', () => {
            const resultsData = JSON.parse(localStorage.getItem('resultsData')) || {};
            const hasResults = Object.keys(resultsData).length > 0;

            if (hasResults && !confirm("La sélection de nouveaux pictos réinitialisera les résultats.\nCertain ?")) {
                return;
            }

            if (hasResults) {
                localStorage.removeItem('resultsData');
            }

            pictoButton.style.opacity = pictoButton.style.opacity === '0.15' ? '1' : '0.15';
            saveSettings();
        });

        return pictoButton;
    }

    // Crée une catégorie de pictos spécifique avec deux lignes de pictos.
    function createPictosSectionTwoRows(container, category) {
        const categoryTitle = createCategoryTitle(category);
        categoryTitle.style.position = 'relative';
        categoryTitle.style.top = '20px';
        container.appendChild(categoryTitle);

        const categoryPictos = document.createElement('div');
        categoryPictos.style.display = 'flex';
        categoryPictos.style.flexWrap = 'wrap';
        categoryPictos.style.gap = '5px';

        const pictos = pictoData.filter(picto => picto.category === category);
        const midIndex = Math.ceil(pictos.length / 2);

        const firstRow = pictos.slice(0, midIndex);
        const secondRow = pictos.slice(midIndex);

        firstRow.forEach(picto => {
            const pictoButton = createPictoButton(picto);
            pictoButton.style.marginBottom = '1px';
            pictoButton.setAttribute('data-category', category);
            categoryPictos.appendChild(pictoButton);
        });

        const separator = document.createElement('div');
        separator.style.width = '100%';
        categoryPictos.appendChild(separator);

        secondRow.forEach(picto => {
            const pictoButton = createPictoButton(picto);
            pictoButton.setAttribute('data-category', category);
            categoryPictos.appendChild(pictoButton);
        });

        container.appendChild(categoryPictos);
    }

    // Crée une catégorie standard de pictos avec une seule ligne de pictos.
    function createPictosSection(container, category) {
        const categoryTitle = createCategoryTitle(category);
        container.appendChild(categoryTitle);

        const categoryPictos = document.createElement('div');
        categoryPictos.style.display = 'flex';
        categoryPictos.style.flexWrap = 'wrap';
        categoryPictos.style.gap = '5px';

        pictoData.filter(picto => picto.category === category).forEach(picto => {
            const pictoButton = createPictoButton(picto);
            pictoButton.setAttribute('data-category', category);
            categoryPictos.appendChild(pictoButton);
        });

        container.appendChild(categoryPictos);
    }

    // Crée le titre d'une catégorie avec le style et les interactions définis.
    function createCategoryTitle(category) {
        const categoryTitle = document.createElement('div');
        categoryTitle.innerText = category;
        categoryTitle.style.display = 'inline-block';
        categoryTitle.style.width = '90%';
        categoryTitle.style.height = '30px';
        categoryTitle.style.padding = '5px';
        categoryTitle.style.margin = '2px';
        categoryTitle.style.marginLeft = '15px';
        categoryTitle.style.border = `2px solid ${colors.darkBrown}`;
        categoryTitle.style.borderRadius = '5px';
        categoryTitle.style.textAlign = 'center';
        categoryTitle.style.cursor = 'pointer';
        categoryTitle.style.fontSize = '1.3rem';
        categoryTitle.style.fontWeight = 'bold';
        categoryTitle.style.backgroundColor = colors.mediumBrown;
        categoryTitle.style.color = colors.lightGold;
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('data-category', category);

        categoryTitle.addEventListener('mouseover', () => {
            categoryTitle.style.borderColor = colors.lightGold;
            categoryTitle.style.backgroundColor = colors.commonBrown;
        });

        categoryTitle.addEventListener('mouseout', () => {
            categoryTitle.style.borderColor = colors.darkBrown;
            categoryTitle.style.backgroundColor = colors.mediumBrown;
        });

        categoryTitle.addEventListener('click', () => {
            const resultsData = JSON.parse(localStorage.getItem('resultsData')) || {};
            const hasResults = Object.keys(resultsData).length > 0;

            if (hasResults && !confirm("La sélection de nouveaux pictos réinitialisera les résultats.\nCertain ?")) {
                return;
            }

            if (hasResults) {
                localStorage.removeItem('resultsData');
            }

            const isSelected = categoryTitle.style.opacity === '0.15';
            categoryTitle.style.opacity = isSelected ? '1' : '0.15';

            const pictos = document.querySelectorAll(`.picto-button[data-category="${category}"]`);
            pictos.forEach(picto => {
                picto.style.opacity = isSelected ? '1' : '0.15';
            });

            saveSettings(category);
        });

        return categoryTitle;
    }

    // Crée le bouton principal "Pictos Scanner" avec le style et les interactions définis.
    function createMainButton() {
        const button = document.createElement('button');
        const isPersonalSoulPage = window.location.pathname.endsWith('/me');

        button.id = 'pictos-scanner-button';
        button.innerText = 'Pictos Scanner';

        button.style.width = '75%' ;
        button.style.margin = isPersonalSoulPage ? '6px 5px 5px 26px' : '11px 5px 5px 30px';
        button.style.background = 'url(/build/images/assets/img/background/bg_button.209bcd56..gif) 50%/cover no-repeat';
        button.style.border = `solid 1px ${colors.black}`;
        button.style.borderRadius = '2px';
        button.style.boxShadow = `0 0 2px ${colors.black}`;
        button.style.color = colors.lightGold;
        button.style.cursor = 'pointer';
        button.style.fontVariant = 'small-caps';
        button.style.fontWeight = '700';
        button.style.minHeight = '26px';
        button.style.padding = '0 8px';
        button.style.textAlign = 'center';
        button.style.outline = '1px solid transparent';
        button.style.transition = 'outline-color 0s';

        button.addEventListener('mouseover', () => {
            button.style.color = colors.white;
            button.style.outlineColor = colors.lightGold;
        });

        button.addEventListener('mouseout', () => {
            button.style.color = colors.lightGold;
            button.style.outlineColor = 'transparent';
        });

        button.addEventListener('click', () => displayPopup());

        return button;
    }

    // Crée le bouton de scan du joueur avec le style et les interactions définis.
    function createScanButton() {
        const scanButton = document.createElement('button');
        const isPersonalSoulPage = window.location.pathname.endsWith('/me');

        scanButton.id = 'scan-player-button';

        scanButton.style.width = '15%';
        scanButton.style.margin = isPersonalSoulPage ? '6px 22px 5px 0' : '11px 27px 5px 0';
        scanButton.style.background = 'url(/build/images/assets/img/background/bg_button.209bcd56..gif) 50%/cover no-repeat';
        scanButton.style.border = `solid 1px ${colors.black}`;
        scanButton.style.borderRadius = '2px';
        scanButton.style.boxShadow = `0 0 2px ${colors.black}`;
        scanButton.style.cursor = 'pointer';
        scanButton.style.minHeight = '26px';
        scanButton.style.padding = '0';
        scanButton.style.display = 'flex';
        scanButton.style.alignItems = 'center';
        scanButton.style.justifyContent = 'center';

        const scanImage = document.createElement('img');
        scanImage.src = '/build/images/forum/search.153b1741.png';
        scanImage.style.alignItems = 'center';
        scanImage.style.width = '18px';
        scanImage.style.height = '18px';
        scanImage.style.marginTop = '2px';
        scanImage.style.marginLeft = '6px';
        scanButton.style.transition = 'outline-color 0s';
        scanButton.appendChild(scanImage);

        scanButton.addEventListener('mouseover', () => {
            scanButton.style.color = colors.white;
            scanButton.style.outlineColor = colors.lightGold;
        });

        scanButton.addEventListener('mouseout', () => {
            scanButton.style.color = colors.lightGold;
            scanButton.style.outlineColor = 'transparent';
        });

        scanButton.addEventListener('click', () => {
            const { playerId, playerName } = getPlayerInfo();
            if (playerId && playerName) {
                saveData(playerId, playerName);
                alert(`Scan effectué pour ${playerName}.`);
            } else {
                alert("Impossible de récupérer l'ID ou le nom du joueur.");
            }
        });

        return scanButton;
    }

    // Crée la fenêtre popup principale avec tous les composants nécessaires.
    function createPopup() {
        const popup = document.createElement('div');
        popup.id = 'pictos-scanner-popup';
        popup.className = 'pictos-scanner-window visible';
        popup.style.position = 'fixed';
        popup.style.top = '10%';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.width = 'auto';
        popup.style.maxWidth = '90%';
        popup.style.backgroundColor = colors.mediumBrown;
        popup.style.border = `1px solid ${colors.lightGold}`;
        popup.style.zIndex = '10000';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        popup.style.fontFamily = 'Verdana, sans-serif';
        popup.style.overflow = 'hidden';
        popup.style.maxHeight = '90vh';
        popup.style.overflowY = 'auto';

        return popup;
    }

    // Crée et stylise la barre d'onglets pour naviguer entre différentes sections de la popup.
    function createTabBar() {
        const tabContainer = document.createElement('div');
        tabContainer.className = 'row';
        tabContainer.style.position = 'sticky';
        tabContainer.style.top = '0';
        tabContainer.style.zIndex = '10';
        tabContainer.style.backgroundColor = colors.mediumBrown;

        const tabCell = document.createElement('div');
        tabCell.className = 'padded cell rw-12';

        const tabs = document.createElement('ul');
        tabs.className = 'tabs plain no-top-margin no-bottom-margin';
        tabs.style.marginBottom = '10px';
        tabs.style.display = 'flex';
        tabs.style.justifyContent = 'flex-start';
        tabs.style.gap = '0px';

        const tabNames = ['Sélection', 'Résultats'];
        const panels = [];

        tabNames.forEach((name, index) => {
            const tab = document.createElement('li');
            tab.className = 'tab';
            if (index === 0) tab.classList.add('selected');

            const tabLink = document.createElement('div');
            tabLink.className = 'tab-link';
            tabLink.innerHTML = `<span>${name}</span>`;

            tabLink.addEventListener('click', () => {
                panels.forEach(panel => panel.style.display = 'none');
                document.querySelectorAll('.pictos-scanner-window .tabs .tab').forEach(t => t.classList.remove('selected'));
                tab.classList.add('selected');
                panels[index].style.display = 'block';

                if (name === 'Résultats') {
                    saveSettings();
                    const resultsPanel = panels[1];
                    resultsPanel.innerHTML = '';
                    const updatedResultsPanel = createResultsPanel();
                    resultsPanel.appendChild(updatedResultsPanel);
                }
            });

            tab.appendChild(tabLink);
            tabs.appendChild(tab);
        });

        const closeButton = document.createElement('img');
        closeButton.src = 'https://myhordes.fr/build/images/icons/b_close.17c6704e.png';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('mouseover', function() {
            closeButton.style.filter = 'brightness(1.5)';
        });

        closeButton.addEventListener('mouseout', function() {
            closeButton.style.filter = 'brightness(1)';
        });

        document.body.appendChild(closeButton);


        const closeTab = document.createElement('li');
        closeTab.className = 'tab';
        closeTab.appendChild(closeButton);

        closeButton.addEventListener('click', () => {
            const popup = document.getElementById('pictos-scanner-popup');
            if (popup) {
                popup.remove();
            }
        });

        tabs.appendChild(document.createElement('div')).style.flexGrow = '1';
        tabs.appendChild(closeTab);

        tabCell.appendChild(tabs);
        tabContainer.appendChild(tabCell);
        return { tabContainer, panels };
    }

    // Crée le panel de la section "Sélection" avec les catégories de picto.
    function createSelectionPanel() {
        const selectionPanel = document.createElement('div');
        selectionPanel.style.display = 'block';

        const pictoSelectionDiv = document.createElement('div');
        pictoSelectionDiv.style.display = 'grid';
        pictoSelectionDiv.style.gridTemplateColumns = '30% 70%';
        pictoSelectionDiv.style.gap = '10px';

        const categories = [...new Set(pictoData.map(picto => picto.category))];
        categories.forEach(category => {
            if (category === 'Divers') {
                createPictosSectionTwoRows(pictoSelectionDiv, category);
            } else {
                createPictosSection(pictoSelectionDiv, category);
            }
        });

        selectionPanel.appendChild(pictoSelectionDiv);

        loadSettings();

        return selectionPanel;
    }

    // Crée le panel de la section "Résultats" pour afficher les résultats de l'analyse.
    function createResultsPanel() {

        // Conteneur principal des résultats
        const resultsPanel = document.createElement('div');
        resultsPanel.style.display = 'flex';
        resultsPanel.style.flexDirection = 'column';
        resultsPanel.style.alignItems = 'center';
        resultsPanel.style.margin = '10px';
        resultsPanel.style.padding = '0';
        resultsPanel.style.height = '100%';
        resultsPanel.style.overflow = 'hidden';

        // Conteneur pour le tableau défilant
        const tableWrapper = document.createElement('div');
        tableWrapper.style.display = 'block';
        tableWrapper.style.justifyContent = 'center';
        tableWrapper.style.overflow = 'auto';
        tableWrapper.style.height = '495px';
        tableWrapper.style.width = '100%';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.margin = '0 auto';
        //table.style.width = '100%';

        const savedState = JSON.parse(localStorage.getItem('pictosState')) || { pictoStates: {} };
        const sortedPictoData = pictoData
        .filter(picto => savedState.pictoStates[picto.name] === '1')
        .sort((a, b) => a.name.localeCompare(b.name));

        const storedData = JSON.parse(localStorage.getItem('resultsData')) || {};
        const playerIds = Object.keys(storedData);

        if (playerIds.length === 0 || sortedPictoData.length === 0) {
            return resultsPanel;
        }

        // Crée l'en-tête du tableau
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Cellule vide en haut à gauche
        const emptyHeader = document.createElement('th');
        emptyHeader.style.border = 'none';
        emptyHeader.style.boxShadow = `inset 2px 0 0 0 ${colors.darkBrown}, inset 0 2px 0 0 ${colors.darkBrown}, inset -1px 0 0 0 ${colors.darkBrown}, inset 0 -1px 0 0 ${colors.darkBrown}`;
        emptyHeader.style.padding = '4px';
        emptyHeader.style.backgroundColor = colors.mediumBrown;
        emptyHeader.style.position = 'sticky';
        emptyHeader.style.top = '0';
        emptyHeader.style.left = '0';
        emptyHeader.style.zIndex = '4';
        headerRow.appendChild(emptyHeader);

        // Ajouter les pictos à l'en-tête
        sortedPictoData.forEach((picto, index) => {
            const pictoHeader = document.createElement('th');
            const pictoImage = document.createElement('img');
            pictoImage.src = specialPictoUrls[picto.id] || `https://gitlab.com/eternaltwin/myhordes/myhordes/-/raw/master/assets/img/pictos/${picto.id}.gif`;
            pictoImage.alt = picto.name;
            pictoImage.style.width = '16px';
            pictoImage.style.height = '16px';
            pictoHeader.appendChild(pictoImage);
            pictoHeader.style.border = 'none';
            pictoHeader.style.boxShadow = `inset 1px 0 0 0 ${colors.darkBrown}, inset 0 2px 0 0 ${colors.darkBrown}, inset -1px 0 0 0 ${colors.darkBrown}, inset 0 -1px 0 0 ${colors.darkBrown}`;
            if (index === sortedPictoData.length - 1) {
                pictoHeader.style.boxShadow += `, 1px 0 0 0 ${colors.darkBrown}`;
            }

            pictoHeader.style.padding = '4px';
            pictoHeader.style.width = '36px';
            pictoHeader.style.height = '36px';
            pictoHeader.style.textAlign = 'center';
            pictoHeader.style.backgroundColor = colors.mediumBrown;
            pictoHeader.style.position = 'sticky';
            pictoHeader.style.top = '0';
            pictoHeader.style.zIndex = '3';
            headerRow.appendChild(pictoHeader);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crée le corps du tableau
        const tbody = document.createElement('tbody');

        playerIds.forEach((playerId, rowIndex) => {
            const playerData = storedData[playerId];

            const row = document.createElement('tr');
            row.style.height = '27px';

            // Colonne des pseudos
            const playerCell = document.createElement('td');
            const playerLink = document.createElement('a');
            playerLink.className = 'username undecorated';
            playerLink.setAttribute('x-user-id', playerId);
            playerLink.innerText = playerData.playerName;
            playerLink.style.whiteSpace = 'nowrap';
            playerLink.style.cursor = 'pointer';
            playerLink.style.textAlign = 'center';
            playerLink.style.display = 'block';

            playerCell.appendChild(playerLink);
            playerCell.style.border = 'none';
            playerCell.style.boxShadow = `inset 2px 0 0 0 ${colors.darkBrown}, inset 0 1px 0 0 ${colors.darkBrown}, inset -1px 0 0 0 ${colors.darkBrown}, inset 0 -1px 0 0 ${colors.darkBrown}`;
            playerCell.style.padding = '4px';
            playerCell.style.fontSize = '11px';
            playerCell.style.backgroundColor = colors.mediumBrown;
            playerCell.style.width = '120px';
            playerCell.style.position = 'sticky';
            playerCell.style.left = '0';
            playerCell.style.zIndex = '2';
            playerCell.style.verticalAlign = 'middle';
            row.appendChild(playerCell);

            // Ajouter les valeurs pour chaque picto
            sortedPictoData.forEach((picto, index) => {
                const valueCell = document.createElement('td');
                valueCell.style.border = `1px solid ${colors.darkBrown}`;
                if (index === 0) {
                    valueCell.style.borderLeft = `1px solid ${colors.darkBrown}`;
                }
                if (index === sortedPictoData.length - 1) {
                    valueCell.style.borderRight = `2px solid ${colors.darkBrown}`;
                }
                valueCell.style.padding = '4px';
                valueCell.style.textAlign = 'center';
                valueCell.style.fontSize = '10px';

                const pictoDataForPlayer = playerData.pictosData.find(p => p.pictoId === picto.id) || {};
                valueCell.innerText = pictoDataForPlayer.value || '0';

                row.appendChild(valueCell);
            });

            if (rowIndex === playerIds.length - 1) {
                // Appliquer une bordure plus épaisse en bas de la dernière rangée
                row.querySelectorAll('td').forEach(cell => {
                    cell.style.borderBottom = `2px solid ${colors.darkBrown}`;
                });
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        resultsPanel.appendChild(tableWrapper);

        // Ajouter les boutons en bas du tableau
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '5px';
        buttonContainer.style.marginBottom = '5px';

        const resetResultsButton = createResetResultsButton();
        const resetCopyButton = createCopyResultsButton();

        buttonContainer.appendChild(resetCopyButton);
        buttonContainer.appendChild(resetResultsButton);
        resultsPanel.appendChild(buttonContainer);

        return resultsPanel;
    }

    // Fonction utilitaire pour créer un bouton avec des styles et comportements communs.
    function createCustomButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;

        button.style.background = 'url(/build/images/assets/img/background/bg_button.209bcd56..gif) 50%/cover no-repeat';
        button.style.border = `solid 1px ${colors.black}`;
        button.style.borderRadius = '2px';
        button.style.boxShadow = `0 0 2px ${colors.black}`;
        button.style.color = colors.lightGold;
        button.style.cursor = 'pointer';
        button.style.fontVariant = 'small-caps';
        button.style.fontWeight = '700';
        button.style.minHeight = '26px';
        button.style.padding = '0 8px';
        button.style.textAlign = 'center';
        button.style.outline = '1px solid transparent';
        button.style.transition = 'outline-color 0s';
        button.style.margin = '15px auto';
        button.style.display = 'block';
        button.style.width = 'auto';

        button.addEventListener('mouseover', () => {
            button.style.color = colors.white;
            button.style.outlineColor = colors.lightGold;
        });

        button.addEventListener('mouseout', () => {
            button.style.color = colors.lightGold;
            button.style.outlineColor = 'transparent';
        });

        button.addEventListener('click', onClick);

        return button;
    }

    // Crée le bouton de réinitialisation des pictos dans l'onglet Sélection.
    function createResetPictosButton() {
        return createCustomButton('reset-pictos', 'Réinitialiser les pictos', () => {
            if (confirm('La réinitialisation des pictos supprimera les résultats actuels.\nCertain ?')) {
                localStorage.removeItem('pictosState');
                localStorage.removeItem('resultsData');
                location.reload();
            }
        });
    }

    // Crée le bouton de réinitialisation des résultats dans l'onglet Résultats.
    function createResetResultsButton() {
        return createCustomButton('reset-results', 'Réinitialiser les résultats', () => {
            if (confirm('Certain ?')) {
                localStorage.removeItem('resultsData');
                location.reload();
            }
        });
    }

    // Crée le bouton de copie des résultats dans l'onglet Résultats.
    function createCopyResultsButton() {

        return createCustomButton('copy-results', 'Copier les résultats', () => {
            const table = document.querySelector('.pictos-scanner-window table');
            if (!table) {
                alert("P'tête que tu devrais scanner une âme dans un premier temps ?");
                return;
            }

            let resultText = '';

            const rows = table.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td, th');
                let rowText = '';

                if (rowIndex === 0) {
                    rowText += `ID\tPSEUDO\t`;

                    for (let index = 1; index < cells.length; index++) {
                        const img = cells[index].querySelector('img');
                        if (img) {
                            rowText += `${img.alt}\t`;
                        } else {
                            rowText += `${cells[index].innerText.trim()}\t`;
                        }
                    }
                } else {
                    const link = cells[0].querySelector('a');
                    if (link) {
                        const playerId = link.getAttribute('x-user-id');
                        const playerName = link.innerText.trim();
                        rowText += `${playerId}\t${playerName}\t`;
                    }

                    for (let index = 1; index < cells.length; index++) {
                        rowText += `${cells[index].innerText.trim()}\t`;
                    }
                }

                resultText += rowText.trim() + '\n';
            });

            navigator.clipboard.writeText(resultText).then(() => {
                alert('Résultats copiés dans le presse-papiers.');
            }).catch(err => {
                console.error('Erreur lors de la copie des résultats : ', err);
                alert('Erreur lors de la copie des résultats.');
            });
        });
    }



    // *************************************************************************************************** //
    // Fonctions d'interaction avec l'utilisateur (affichage de la popup, ajout des boutons à l'interface) //
    // *************************************************************************************************** //

    // Coordonne la création et l'affichage de la fenêtre popup en appelant les fonctions correspondantes.
    function displayPopup() {
        const existingPopup = document.getElementById('pictos-scanner-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = createPopup();
        const { tabContainer, panels } = createTabBar();

        const selectionPanel = createSelectionPanel();
        const resultsPanel = createResultsPanel();

        selectionPanel.style.display = 'block';
        resultsPanel.style.display = 'none';

        selectionPanel.innerHTML = '';
        resultsPanel.innerHTML = '';

        selectionPanel.appendChild(createSelectionPanel());
        resultsPanel.appendChild(createResultsPanel());

        const resetPictosButton = createResetPictosButton();
        selectionPanel.appendChild(resetPictosButton);

        panels.push(selectionPanel, resultsPanel);
        popup.appendChild(tabContainer);
        popup.appendChild(selectionPanel);
        popup.appendChild(resultsPanel);

        document.body.appendChild(popup);

        loadSettings();

        requestAnimationFrame(() => {
            resultsPanel.style.margin = '0';
            const rect = selectionPanel.getBoundingClientRect();
            resultsPanel.style.minHeight = `${rect.height}px`;
            resultsPanel.style.maxHeight = `${rect.height}px`;
            resultsPanel.style.minWidth = `${rect.width}px`;
            resultsPanel.style.maxWidth = `${rect.width}px`;
        });


    }

    // Ajoute les boutons principaux à l'interface si ce n'est pas déjà fait.
    function addScannerButton() {
        const container = document.querySelector('.row.soul .cell.rw-5.rw-sm-12.center');
        if (container && !document.querySelector('#pictos-scanner-button')) {
            const mainButton = createMainButton();
            const scanButton = createScanButton();

            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.display = 'flex';
            buttonWrapper.style.justifyContent = 'space-between';
            buttonWrapper.style.width = '100%';

            buttonWrapper.appendChild(mainButton);
            buttonWrapper.appendChild(scanButton);

            container.insertBefore(buttonWrapper, container.firstChild);
        }
    }


    // *************************************************************************************************** //
    // Initialisation                                                                                      //
    // *************************************************************************************************** //

    function logUrlChange() {
        if (window.location.pathname.includes('/jx/soul/')) {
            if (!window.hasScannerBeenInitialized) {
                window.hasScannerBeenInitialized = true;
                const observer = new MutationObserver(addScannerButton);
                observer.observe(document.body, { childList: true, subtree: true });
                addScannerButton();
            }
        }
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        logUrlChange();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        logUrlChange();
    };

    window.addEventListener('popstate', logUrlChange);
    window.addEventListener('load', logUrlChange);

})();
