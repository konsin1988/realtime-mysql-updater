package car

type DataFormCar struct {
  ID		    int64     `json:"id"`
  Model		    string    `json:"model"`
  Count		    int	      `json:"count"`
  Price		    float64   `json:"price"`
  TotalPrice	    float64   `json:"total_price"`
  ModelDescription  string    `json:"model_description"`
}
