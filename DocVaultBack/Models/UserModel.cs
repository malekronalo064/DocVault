namespace DocVault.Models
{
    public class User
    {
        public Guid Id { get; set; } // ID unique de l'utilisateur
        public string Username { get; set; } // Nom d'utilisateur
        public string Email { get; set; } // Adresse email
        public string AccessToken { get; set; } // Le jeton JWT reçu
        public DateTime Expiration { get; set; } // Expiration du token
    
        // public List<Document> Documents { get; set; } // Liste des documents associés à l'utilisateur
    
        // public User()
        // {
        //     Documents = new List<Document>();
        // }
    }
}