using System.IO;
using System.Security.Cryptography.X509Certificates;
using Azure.Storage.Blobs.Models;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;

public class AzureBlobService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    public string AccountName { get; }

    public AzureBlobService(IConfiguration configuration)
    {
        var connectionString = configuration["AzureBlobStorage:ConnectionStrings"];
        _containerName = configuration["AzureBlobStorage:ContainerName"];
        _blobServiceClient = new BlobServiceClient(connectionString);
        // _blobServiceClient = new BlobServiceClient(configuration.GetConnectionString("AzureBlobStorage"));
        // _containerName = configuration["AzureBlobStorage:ContainerName"];

        // Extract the account name from the connection string
        var accountNameMatch = System.Text.RegularExpressions.Regex.Match(connectionString, @"AccountName=([^;]+)");
        if (accountNameMatch.Success)
        {
            AccountName = accountNameMatch.Groups[1].Value;
        }
        else
        {
            throw new InvalidOperationException("AccountName not found in connection string.");
        }
        
    }

    public string GetContainerSasToken()
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        // Define the SAS token parameters
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            Resource = "c", // c for container
            ExpiresOn = DateTimeOffset.UtcNow.AddHours(3) // Set the expiration time expiration 3h
        };
        // Set the permissions for the SAS token
        sasBuilder.SetPermissions(BlobContainerSasPermissions.Read | BlobContainerSasPermissions.Write | BlobContainerSasPermissions.Delete);
        
        if (!containerClient.CanGenerateSasUri)
        {
            throw new InvalidOperationException("Le client ne peut pas générer de SAS URI. Vérifiez les permissions du compte de stockage.");
        }
        
        // Generate the SAS token
        var sasToken = containerClient.GenerateSasUri(sasBuilder).Query;
        Console.Write($"sasToken : {sasToken},");

        return sasToken;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = "application/octet-stream" });

        return blobClient.Uri.ToString();
    }

    public async Task<Stream> DownloadFileAsync(string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        var download = await blobClient.DownloadAsync();
        return download.Value.Content;
    }

    public async Task DeleteFileAsync(string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.DeleteAsync();
    }
}
