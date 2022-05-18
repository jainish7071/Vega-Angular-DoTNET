using Microsoft.EntityFrameworkCore;
using vega.Core.Models;
using vega.Core;
using System.Linq;
using System.Linq.Expressions;
using vega.Extensions;

namespace vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;

        }
        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await context.Vehicles.FindAsync(id);
            return await context.Vehicles
            .Include(v => v.Features)
            .ThenInclude(vf => vf.Feature)
            .Include(v => v.Model)
            .ThenInclude(m => m.Make)
            .SingleOrDefaultAsync(v => v.Id == id);
        }
        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }
        public void Remove(Vehicle vehicle)
        {
            context.Remove(vehicle);
        }

        public async Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var result = new QueryResult<Vehicle>();
            var query = context.Vehicles
             .Include(v => v.Model)
             .ThenInclude(m => m.Make)
             .AsQueryable();

            query = query.ApplyFiltering(queryObj);

            var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>()
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.MakeId,
                ["contactName"] = v => v.ContactName
            };
            query = query.ApplyOrdering(queryObj, columnsMap);

            result.TotalItems = await query.CountAsync();

            query = query.ApplyPaging(queryObj);

            // if (queryObj.SortBy == "make")
            //     query = ((bool)queryObj.IsSortAsceding) ? query.OrderBy(v => v.Model.Make.Name) : query.OrderByDescending(v => v.Model.Make.Name);
            // if (queryObj.SortBy == "model")
            //     query = ((bool)queryObj.IsSortAsceding) ? query.OrderBy(v => v.Model.Name) : query.OrderByDescending(v => v.Model.Name);
            // if (queryObj.SortBy == "contactName")
            //     query = ((bool)queryObj.IsSortAsceding) ? query.OrderBy(v => v.ContactName) : query.OrderByDescending(v => v.ContactName);
            // if (queryObj.SortBy == "id")
            //     query = ((bool)queryObj.IsSortAsceding) ? query.OrderBy(v => v.Id) : query.OrderByDescending(v => v.Id);

            result.Items = await query.ToListAsync();
            return result;
        }

    }
}