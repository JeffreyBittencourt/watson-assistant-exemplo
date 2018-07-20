using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    class MensagemController : Controller
    {
        [HttpPost]
        public Mensagem MandarMensagem(Mensagem mensagme)
        {
            return new Mensagem("abs");
        }
    }
}