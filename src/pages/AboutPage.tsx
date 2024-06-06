import { Box, Grid, Typography } from "@mui/material";

const GridColumn = ({
  headerText,
  items,
}: {
  headerText: string;
  items: string[];
}) => (
  <Grid item xs={1}>
    <Typography variant="h5" sx={{ textDecoration: "underline" }}>
      {headerText}
    </Typography>
    <ul style={{ listStyleType: "circle", marginLeft: "20px" }}>
      {items.map((item) => (
        <li style={{ marginTop: "7px" }}>{item}</li>
      ))}
    </ul>
  </Grid>
);

export default function AboutPage() {
  return (
    <Box
      className="h-full flex-1 flex flex-col justify-center items-center align-middle"
      sx={{
        paddingY: {
          xs: "0.75rem",
          sm: "2.0rem",
        },
      }}
    >
      <Box
        className="p-3"
        sx={{
          width: "750px",
          height: "500px",
          backgroundColor: "white",
          borderRadius: "7px",
        }}
      >
        <Grid container columns={3} sx={{ textAlign: "left" }}>
          <GridColumn
            headerText={"Frontend"}
            items={[
              "TypeScript",
              "Vite",
              "React Router v6",
              "ESLint",
              "MUI",
              "Tailwind",
            ]}
          />
          <GridColumn
            headerText={"Backend"}
            items={[
              "TypeScript",
              "Express",
              "Kysely",
              "MySQL Connection",
              "CORS",
              "Cookies",
              "AES",
              "BCrypt",
              "Nodemon",
              "TS-Node",
              "Moment",
            ]}
          />
          <GridColumn
            headerText={"MySQL Database"}
            items={[
              "Oracle Cloud Server",
              "Firewalld/Firewall-Cmd",
              "Ingress Rules",
              "Privileges/Grants",
              "General database management and upkeep",
            ]}
          />
        </Grid>
      </Box>
    </Box>
  );
}
