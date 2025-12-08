import User from "./UserModel.js";
import Player from "./PlayerModel.js";
import Level from "./LevelModel.js";
import Round from "./RoundModel.js";
import Score from "./ScoreModel.js";
import BananaGame from "./BananaModel.js";
import { sequelize } from "../config/db.js";


// User ↔ Player
User.hasOne(Player, { foreignKey: "userId" });
Player.belongsTo(User, { foreignKey: "userId" });

// Level ↔ Round
Level.hasMany(Round, { foreignKey: "levelId", onDelete: "CASCADE" });
Round.belongsTo(Level, { foreignKey: "levelId" });

// Player ↔ Score
Player.hasMany(Score, { foreignKey: "playerId", onDelete: "CASCADE" });
Score.belongsTo(Player, { foreignKey: "playerId" });

// Level ↔ Score
Level.hasMany(Score, { foreignKey: "levelId" });
Score.belongsTo(Level, { foreignKey: "levelId" });

// Player ↔ BananaGame
Player.hasMany(BananaGame, { foreignKey: "playerId", onDelete: "CASCADE" });
BananaGame.belongsTo(Player, { foreignKey: "playerId" });

export { User, Player, Level, Round, Score, BananaGame, sequelize};
