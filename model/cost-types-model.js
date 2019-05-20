const CostTypesRespository = require('../respository/cost-types-respository');
const CacheCostTypesRespository = require('../respository/cache-cost-types-respository');

module.exports = {
  getCostTypesFromCloudAsync: function () {
    return CostTypesRespository.getCostTypesAsync();
  },
  setCostTypesToCloudAsync: function (data) {
    return CostTypesRespository.setCostTypeAsync(data);
  },
  getCostTypeFromLocalAsync: function () {
    return CacheCostTypesRespository.getCostTypesAsync();
  },
  setCostTypesToLocalAsync: function (data) {
    return CacheCostTypesRespository.setCostTypeAsync(data);
  }
}