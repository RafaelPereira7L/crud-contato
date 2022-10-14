import '../css/app.css'

const btn = document.querySelector('.btn-delete')

if (btn) {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    Swal.fire({
      title: 'Deletar',
      text: 'Tem certeza que deseja deletar este contato?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Deletar!',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = btn.getAttribute('href')
      } else {
        return
      }
    })
  })
}
