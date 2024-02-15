import Link from "next/link";
import Image from "next/image";

export default function NavigationNew() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary rounded"
      aria-label="Eleventh navbar example"
    >
      <div className="d-flex flex-row">
        <Link className="navbar-brand" href="/">
          <Image
            alt="Sabiyya Collection"
            src="/images/logo-full.png"
            height={42}
            width={100}
            style={{ objectFit: "contain", objectPosition: "center center" }}
          />
        </Link>
        <div className="collapse navbar-collapse" id="navbarsExample09">
          <ul className="navbar-nav flex-grow-1 justify-content-between">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/featured">
                Featured
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarsExample09"
        aria-controls="navbarsExample09"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </nav>
  );
}
