using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DocVault.Models;
using Microsoft.EntityFrameworkCore;

namespace DocVault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase

    {
        private readonly DocVaultDbContext _context;

        public UserController(DocVaultDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data");
                
            }
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return Ok(new { message = "login success", user = existingUser });
                
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            // _context.SaveChanges();

            return Ok( new { message = "registration successful"});
        }

    }
}
