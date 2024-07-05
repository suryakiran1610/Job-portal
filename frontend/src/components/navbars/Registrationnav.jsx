
function RegisterNavbar() {


  return (
    <>
      <div>
        <header
          className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full  border-b border-gray-700 text-sm py-2.5 sm:py-4 dark:bg-neutral-950 dark:border-neutral-700"
          style={{ backgroundColor: "#A91D3A" }}
        >
          <nav
            className="max-w-7xl flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="me-5 md:me-8 flex">
              <a
                className="flex-none text-xl font-semibold text-white"
                aria-label="Brand"
              >
                Job Portal
              </a>
            </div>

            <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
              

              <div className="hidden mx-auto sm:block"></div>
            </div>
          </nav>
        </header>
      </div>
      
    </>
  );
}

export default RegisterNavbar;

