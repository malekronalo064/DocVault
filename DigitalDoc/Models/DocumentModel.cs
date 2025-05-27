namespace DigitalDoc.Models
{
    public class Document
    {
        public Guid Id { get; set; } // Identifiant unique du document
        public string Name { get; set; } // Nom du fichier
        public string BlobPath { get; set; } // Chemin d'accès au blob Azure
        public DateTime UploadedOn { get; set; } // Date de dépôt
        public Guid UserId { get; set; } // Référence à l'utilisateur
        public User User { get; set; } // Propriétaire du fichier
        public Guid? FolderId { get; set; } // Référence au dossier, si applicable
        public Folder Folder { get; set; } // Dossier parent

        public Document()
        {
            UploadedOn = DateTime.UtcNow;
        }
    }
    
}