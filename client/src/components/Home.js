import React, { PureComponent } from "react";
import "../assets/style.css";
import Nav from "./Home/Nav";
import Content from "./Home/Content";
import Footer from "./Home/Footer";

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({
      email: e.target.email.value,
      password: e.target.password.value
    });
    console.log(this.state);
  };

  render() {
    return (
      <>
   
        <div class="banner-area banner-3">
          <div class="overlay dark-overlay"></div>
          <div class="d-table">
            <div class="d-table-cell">
              <div class="container">
                <div class="row">
                  <div class="col-lg-8 m-auto text-center col-sm-12 col-md-12">
                    <div class="banner-content content-padding">
                      <h5 class="subtitle">A creative agency</h5>
                      <h1 class="banner-title">
                        We craft seo and digital markting services
                      </h1>
                      <p>
                        We provide marketing services to startups and small
                        businesses to looking for a partner for their digital
                        media, design-area.We are a a startup company to be
                        commited to work and time management.
                      </p>

                      <a href="/users/login" class="btn btn-white btn-circled">
                        lets login
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
