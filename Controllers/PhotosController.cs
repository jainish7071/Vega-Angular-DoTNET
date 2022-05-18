using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace vega.Controllers;
[ApiController]
[Route("/api/vehicles/{vehicleId}/photos")]
public class PhotosController : Controller
{
    private readonly IHostingEnvironment host;
    private readonly IVehicleRepository repository;
    private readonly IMapper mapper;
    private readonly PhotoSettings photoSettings;
    private readonly IPhotoRepository photoRepository;
    private readonly IPhotoService photoService;
    public PhotosController(IHostingEnvironment host, IVehicleRepository repository, IPhotoRepository photoRepository, IMapper mapper, IOptionsSnapshot<PhotoSettings> options, IPhotoService photoService)
    {
        this.photoService = photoService;
        this.photoRepository = photoRepository;
        this.photoSettings = options.Value;
        this.mapper = mapper;
        this.repository = repository;
        this.host = host;
    }
    [HttpPost]
    public async Task<IActionResult> Upload(int vehicleId, IFormFile file)
    {
        var vehicle = await this.repository.GetVehicle(vehicleId, includeRelated: false);

        if (vehicle == null) return NotFound();
        if (file == null) return BadRequest("Null file");
        if (file.Length == 0) return BadRequest("Empty File");
        if (file.Length > photoSettings.MaxBytes) return BadRequest("Max file size exceeded");
        if (!photoSettings.IsSupported(file.FileName)) return BadRequest("Invalid file type.");

        var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
        var photo = await photoService.UploadPhoto(vehicle, file, uploadsFolderPath);
        return Ok(mapper.Map<Photo, PhotoResource>(photo));

    }

    [HttpGet]
    public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
    {
        var photos = await photoRepository.GetPhotos(vehicleId);
        return mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
    }

}
