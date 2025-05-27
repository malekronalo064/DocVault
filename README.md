				DIGITALDOC



1-  Introduction
2-  Schéma d'Architecture
3- Explication du Déploiement
4- Technologies Utilisées
5- Instructions d'Installation et d'Exécution
6- Conclusion 



	
1- Introduction


          DigitalDoc est une application web de gestion documentaire destinée aux entreprises pour centraliser, stocker et gérer efficacement leurs documents. Elle permet aux utilisateurs de déposer, consulter, et gérer leurs fichiers en toute sécurité grâce à une interface intuitive. Le système est également intégré avec Microsoft Azure pour garantir une gestion sécurisée des authentifications et des accès aux ressources.

L'application est conçue avec une architecture moderne utilisant Angular pour le frontend et .NET pour le backend. Elle offre une expérience utilisateur fluide et se concentre sur la sécurité des données sensibles.

2-  Schéma d'Architecture

Le schéma ci-dessous illustre l'architecture globale du projet DigitalDoc. Le client représente l'utilisateur qui interagit avec l'application via un navigateur. Les utilisateurs peuvent accéder aux fonctionnalités de DigitalDoc via une interface utilisateur développée en Angular, qui est dynamique et réactive. Toutes les communications entre le navigateur du client et l'API de l'application se font via des requêtes HTTPS, garantissant ainsi la confidentialité et la sécurité des données échangées.
Le frontend est développé avec Angular, ce framework assure :
•	La gestion de l'authentification des utilisateurs en s'intégrant avec Microsoft Entra ID (anciennement Azure AD).
•	La présentation des fonctionnalités de dépôt et consultation de documents via une interface simple et intuitive.
•	Le contrôle de l'accès basé sur les rôles (grâce à l'intégration avec l'API backend) pour afficher ou masquer certaines fonctionnalités en fonction des privilèges de l'utilisateur.
Le backend est développé en .NET, qui gère les requêtes faites par l'interface frontend. Il s'agit de l'API REST qui :
•	Traite les opérations de dépôt, de récupération et de modification des documents.
•	Gère les interactions avec la base de données où les informations des documents (métadonnées) sont stockées.
•	Effectue les opérations de validation des utilisateurs via des requêtes sécurisées vers Microsoft Entra ID pour la gestion des sessions et des permissions.

La base de données est essentielle au stockage des documents et des informations associées .
•	DigitalDoc s'appuie probablement sur SQL Server.
•	Le backend interagit directement avec cette base pour stocker, récupérer et manipuler les informations relatives aux documents.
Microsoft Entra ID assure la gestion de l'authentification et des autorisations. C'est un service de gestion des identités proposé par Microsoft qui offre :
•	L'authentification sécurisée des utilisateurs (OAuth 2.0).
•	La gestion des permissions d'accès en fonction des rôles définis.
•	Un accès fluide et sécurisé à l'application sans nécessiter de création de compte supplémentaire (SSO - Single Sign-On).
      Azure Blob Storage est utilisé pour le stockage des fichiers volumineux, tels que les documents déposés par les utilisateurs. Ce service de stockage est optimisé pour stocker des données non structurées, comme des fichiers PDF, des images, ou d'autres types de documents. Il est hautement scalable, sécurisé et intégré de manière native avec le reste des services Azure, ce qui en fait un choix idéal pour stocker de grands volumes de données.
Le "Modèle" fait référence à la gestion des données de l'application côté backend. Il s'agit probablement d'un ensemble de classes ou d'entités qui définissent les structures de données utilisées pour représenter les documents, les utilisateurs, et autres entités du système. Ces modèles sont utilisés pour gérer la communication entre l'API backend et la base de données.
 

3- Explication du Déploiement

Le déploiement de DigitalDoc implique la mise en place de deux composants majeurs : le frontend (Angular) et le backend (API .NET). Le service d'authentification est géré par Azure AD, ce qui simplifie la configuration de la sécurité.
Déploiement du Frontend (Angular)
1.	Installation des dépendances.
2.	Construction pour la production.
3.	Hébergement.
Déploiement du Backend (API .NET)
1.	Compilation : Le backend doit être compilé en utilisant le SDK .NET Core. Pour compiler et tester l'API localement.
2.	Publication pour le déploiement : Pour déployer l'API, il faut la publier.
3.	Déploiement sur un serveur : L'API peut être déployée sur un serveur dédié ou sur un service cloud comme Azure App Service. Pour déployer via Azure CLI.
4.	Configuration de l'Authentification (Azure AD)

4- Technologies Utilisées

 Angular : Framework JavaScript utilisé pour le développement du frontend.
.NET Core : Framework pour le développement de l'API backend.
Azure Active Directory (Azure AD) : Gestion des identités et authentification.
Microsoft Graph API : Pour la gestion des utilisateurs et des groupes.
SQL Server / Azure Blob Storage : Stockage des données et des documents.
5- Instructions d'Installation et d'Exécution

Pré-requis
•	Node.js et npm pour Angular
•	.NET Core SDK pour l'API backend
•	Azure AD pour la gestion des utilisateurs
•	Base de données (ex: SQL Server) et un compte de stockage Azure pour les documents
Étapes
1.	Cloner le dépôt :
git clone https://github.com/Jeyapriya21/DigitalDoc.git
2.	Installation des dépendances du frontend :
cd DigitalDocFront
npm install
3.	Exécuter l'application Angular :
ng serve
4.	Exécution du backend :
cd DigitalDocBack
dotnet run
5.	Accéder à l'application :
 L'application sera accessible sur http://localhost:4200 par défaut.
6- Conclusion 

Le projet DigitalDoc est conçu pour offrir une solution robuste et sécurisée de gestion des documents, en s'appuyant sur une architecture moderne et évolutive. L'intégration d'Angular pour le frontend et de .NET pour le backend assure une expérience utilisateur fluide et une gestion efficace des données. La mise en œuvre des services Azure, tels que Microsoft Entra ID pour l'authentification et Azure Blob Storage pour le stockage des documents, garantit un haut niveau de sécurité et une capacité de stockage quasiment illimitée.
Cette architecture modulaire permet à l'application d'être facilement maintenue et améliorée, tout en s'adaptant aux besoins croissants des utilisateurs. Grâce à l'intégration de services cloud, DigitalDoc est bien positionné pour évoluer à grande échelle, tout en assurant des performances et une sécurité optimale. En combinant simplicité d'utilisation et sophistication technologique, ce projet répond parfaitement aux attentes d'une gestion documentaire moderne et professionnelle.


