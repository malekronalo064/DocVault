namespace DocVault.Models
{
    public class Folder
    {
        public Guid Id { get; set; } // Identifiant unique du dossier
        public string Name { get; set; } // Nom du dossier
        public Guid UserId { get; set; } // Référence à l'utilisateur
        public User User { get; set; } // Propriétaire du dossier
        public Guid? ParentFolderId { get; set; } // Référence au dossier parent
        public Folder ParentFolder { get; set; } // Dossier parent
        public List<Document> Documents { get; set; } // Liste des documents associés au dossier
        public List<Folder> Folders { get; set; } // Liste des sous-dossiers
    
        public Folder()
        {
            Documents = new List<Document>();
            Folders = new List<Folder>();
        }
    }
    
}