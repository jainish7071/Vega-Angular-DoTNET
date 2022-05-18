using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;
using vega.Core.Models;
using vega.Core;
using Microsoft.AspNetCore.Authorization;

namespace vega.Controllers;
[ApiController]
[Route("api/[controller]")]
public class VehiclesController : Controller
{
    private readonly IMapper mapper;
    private readonly IVehicleRepository repository;
    private readonly IUnitOfWork unitOfWork;
    public VehiclesController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
    {
        this.unitOfWork = unitOfWork;
        this.repository = repository;
        this.mapper = mapper;

    }

    // [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
        vehicle.LastUpdate = DateTime.Now;
        repository.Add(vehicle);
        await unitOfWork.CompleteAsync();
        await repository.GetVehicle(vehicle.Id);

        var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

        return Ok(result);
    }
    // [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        var vehicle = await repository.GetVehicle(id);
        if (vehicle == null)
        {
            return NotFound();
        }

        mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);

        vehicle.LastUpdate = DateTime.Now;

        await unitOfWork.CompleteAsync();
        vehicle = await repository.GetVehicle(id);

        var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

        return Ok(result);
    }
    // [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var vehicle = await repository.GetVehicle(id, includeRelated: false);
        if (vehicle == null)
        {
            return NotFound();
        }
        repository.Remove(vehicle);
        await unitOfWork.CompleteAsync();
        return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
        var vehicle = await repository.GetVehicle(id);
        if (vehicle == null)
        {
            return NotFound();
        }
        var vehicleResource = mapper.Map<Vehicle, VehicleResource>(vehicle);
        return Ok(vehicleResource);
    }

    [HttpGet]
    public async Task<QueryResultResource<VehicleResource>> GetVehicles([FromQuery] VehicleQueryResource? queryResourceObj)
    {
        var queryObj = mapper.Map<VehicleQueryResource, VehicleQuery>(queryResourceObj);
        var queryResult = await repository.GetVehicles(queryObj);
        return mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
    }

}
