namespace vega.Controllers.Resources
{
    public class VehicleQueryResource
    {
        public int? makeId { get; set; }

        public int? modelId { get; set; }

        public string? SortBy { get; set; }

        public bool? IsSortAscending { get; set; }

        public int? Page { get; set; }
        public int? PageSize { get; set; }

    }
}