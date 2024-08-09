import { indexKecamatan, indexKecamatanByKota, indexKelurahan, indexKelurahanByKecamatan, indexKodePos, indexKodePosByKecamatan, indexKota, indexKotaByProvinsi, indexProvinsi, showCompleteAddress } from "./indo/service"
export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    return;
  }
  const url = event.context.params.endpoint.split('/')
  const query = getQuery(event)
  if (url[0] === 'provinsi') {
    if (url[1] && url[2] && url[3]) {
      const kota = {
        id_provinsi: url[1], 
        id_kabupaten: url[2], 
        id_kecamatan: url[3]
      }
      return showCompleteAddress(kota)
    }
    return indexProvinsi()
  }
  else if (url[0] === 'kota') {
    if (url[1]) {
      return indexKotaByProvinsi(url[1])
    }
    return indexKota()
  }
  else if (url[0] === 'kecamatan') {
    if (url[1]) {
      return indexKecamatanByKota(url[1])
    }
    return indexKecamatan()
  }
  else if (url[0] === 'kelurahan') {
    if (url[1]) {
      return indexKelurahanByKecamatan(url[1])
    }
    return indexKelurahan()
  }
  else if (url[0] === 'kode-pos') {
    if (url[1]) {
      return indexKodePosByKecamatan(url[1])
    }
    return indexKodePos()
  }
})
