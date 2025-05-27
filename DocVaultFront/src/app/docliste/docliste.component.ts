import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';

interface Document {
  name: string;
  extension: string;
}

interface Folder {
  name: string;
  isOpen: boolean;
  documents: Document[];
}

@Component({
  selector: 'app-docliste',
  templateUrl: './docliste.component.html',
  styleUrls: ['./docliste.component.css']
})
export class DoclisteComponent {
  folders: Folder[] = [
    {
      name: 'Dossier 1',
      isOpen: false,
      documents: [
        { name: 'fichier1', extension: '.docx' },
        { name: 'fichier2', extension: '.xml' }
      ]
    },
    {
      name: 'Dossier 2',
      isOpen: false,
      documents: [
        { name: 'fichier3', extension: '.pdf' },
        { name: 'fichier4', extension: '.txt' }
      ]
    },
    {
      name: 'Dossier 3',
      isOpen: false,
      documents: []
    }
  ];

  showForm: boolean = false;
  newDocument: Document = { name: '', extension: '' };
  newFolder: Folder = { name: '', isOpen: false, documents: [] };
  selectedFolder: Folder | null = null;

  constructor(private notificationService: NotificationService) { }

  ouvrirFormulaire() {
    this.showForm = true;
  }

  ajouterDossier() {
    if (this.newFolder.name) {
      this.folders.push({ ...this.newFolder });
      this.notificationService.showNotification(`Dossier "${this.newFolder.name}" ajouté avec succès`, 'success');
      this.resetForm();
    } else {
      this.notificationService.showNotification('Veuillez entrer un nom pour le dossier.', 'error');
    }
  }

  supprimerDossier(folderName: string) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier: ${folderName}?`)) {
      this.folders = this.folders.filter(folder => folder.name !== folderName);
      this.notificationService.showNotification(`Dossier ${folderName} supprimé`, 'success');
    }
  }


  resetForm() {
    this.newFolder = { name: '', isOpen: false, documents: [] };
    this.showForm = false;
  }

  toggleFiles(selectedFolder: Folder) {
    this.folders.forEach(folder => {
      if (folder !== selectedFolder) {
        folder.isOpen = false;
      }
    });
    selectedFolder.isOpen = !selectedFolder.isOpen;
  }

  telechargerDocument(documentName: string) {
    this.notificationService.showNotification(`Télécharger le document: ${documentName} (fonctionnalité à implémenter)`, 'info');
  }

  supprimerDocument(documentName: string) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le document: ${documentName}?`)) {
      this.notificationService.showNotification(`Document ${documentName} supprimé`, 'success');
    }
  }
}
