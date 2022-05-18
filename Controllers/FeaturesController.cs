using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Core.Models;
using vega.Persistence;

namespace vega.Controllers;
[ApiController]
[Route("api/[controller]")]

public class FeaturesController : Controller
{
    private readonly VegaDbContext context;
    private readonly IMapper mapper;
    public FeaturesController(VegaDbContext context, IMapper mapper)
    {
        this.mapper = mapper;
        this.context = context;
    }
    [HttpGet]
    public async Task<IEnumerable<KeyValuePairResource>> Get()
    {
        var features = await context.Features.ToListAsync();
        return mapper.Map<List<Feature>, List<KeyValuePairResource>>(features);
    }
}
