package main

import (
	"os"
	"path/filepath"
	"strings"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Sound struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

func listSounds() ([]Sound, error) {
	files, err := os.ReadDir("assets")
	if err != nil {
		return nil, err
	}
	res := []Sound{}
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		if filepath.Ext(file.Name()) != ".mp3" {
			continue
		}

		res = append(res, Sound{
			Name: strings.Split(file.Name(), ".")[0],
			URL:  "/sounds/" + file.Name(),
		})
	}
	return res, nil
}

func main() {
	e := echo.New()
	e.Use(
		middleware.CORS(),
		middleware.GzipWithConfig(middleware.GzipConfig{
			Level: 5,
		}),
		middleware.StaticWithConfig(middleware.StaticConfig{
			Root:  "client/dist",
			HTML5: true,
		}),
		middleware.Secure(),
		middleware.LoggerWithConfig(middleware.LoggerConfig{
			Format: "method=${method}, uri=${uri}, status=${status}\n",
		}),
	)
	e.Static("/sounds", "assets")
	e.GET("/api/sounds", func(c echo.Context) error {
		sounds, err := listSounds()
		if err != nil {
			return err
		}
		return c.JSON(200, sounds)
	})
	port := os.Getenv("PORT")
	e.Logger.Fatal(e.Start(":" + port))
}
