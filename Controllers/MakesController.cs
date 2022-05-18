using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Core.Models;
using vega.Persistence;

namespace vega.Controllers;
[ApiController]
[Route("api/[controller]")]

public class MakesController : Controller
{
    private readonly VegaDbContext context;
    private readonly IMapper mapper;
    public MakesController(VegaDbContext context, IMapper mapper)
    {
        this.mapper = mapper;
        this.context = context;
    }
    [HttpGet]
    public async Task<IEnumerable<MakeResource>> Get()
    {
        var makes = await context.Makes.Include(m => m.Models).ToListAsync();
        return mapper.Map<List<Make>, List<MakeResource>>(makes);
    }
}
