import { FileUploadService } from '../services/file-upload.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrl: './file-upload-form.component.css'
})
export class FileUploadFormComponent {
  fileForm: FormGroup;
  folders =['Personnel', 'Administration', 'Juridique', 'Dossier', 'Document'];
  filteredFolders: string[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null;
  showDropdown: boolean = false;
  private folderValueChangesSubscription: any;

  constructor(private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.fileForm = this.fb.group({
      fileName: ['', Validators.required],
      folder: ['']
    });

    this.subscribeToFolderValueChanges();
  }

  private subscribeToFolderValueChanges() {
    this.folderValueChangesSubscription = this.fileForm.get('folder')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterFolders(value);
      });
  }

  filterFolders(value: string) {
    if (value && value.length > 1 && !this.folders.includes(value)) {
      this.filteredFolders = this.folders.filter(folder => 
        folder.toLowerCase().includes(value.toLowerCase())
      );
      this.showDropdown = true;
    } else {
      this.filteredFolders = [];
      this.showDropdown = false;
    }
  }

  onFolderSelected(folder: string) {
    this.fileForm.get('folder')?.setValue(folder);
    this.subscribeToFolderValueChanges();
    this.showDropdown = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const validExtensions = ['pdf', 'xml', 'doc', 'docx', 'txt'];

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if(validExtensions.includes(fileExtension!)){
        this.selectedFile = file;
        this.fileError = null;
      } else {
        this.selectedFile = null;
        this.fileError = "Le fichier sélectionné n'est pas adapté, veuillez en sélectionner un autre (pdf, xml, doc, docx).";
      }   
    }
  }

  clearInput(controlName: string): void {
    this.fileForm.get(controlName)?.reset();
    if (controlName === 'folder') {
      this.showDropdown = false;
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.fileError = null;
    const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInputElement) {
      fileInputElement.value = '';
    }
  }

  onSubmit(): void {
    const fileName = this.fileForm.get('fileName')?.value;
    const folder = this.fileForm.get('folder')?.value;

    if (!fileName || !this.selectedFile) {
      this.fileError = "Veuillez sélectionner un fichier valide (pdf, xml, doc, docx) et renseigner les champs obligatoires.";
      console.log("Formulaire invalide");
      return;
    }

    // Récupérer le token d'accès depuis le localStorage
    const tokenKey = Object.keys(localStorage).find(key => key.includes('accesstoken'));
    const token = tokenKey ? JSON.parse(localStorage.getItem(tokenKey) || '{}').secret : null;

    if (!token) {
      console.error("Token non disponible");
      return;
    }

    this.fileUploadService.uploadFile( fileName, folder|| '', this.selectedFile, token).subscribe(
      (response) => {
        console.log("Fichier envoyé avec succès:", response);
        this.clearInput('fileName');
        this.clearInput('folder');
        this.clearFile();
      },
      (error) => {
        console.error("Erreur lors de l'envoi du fichier:", error);
      }
    );  
  }

}
