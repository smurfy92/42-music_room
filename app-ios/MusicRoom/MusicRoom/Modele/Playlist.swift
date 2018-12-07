//
//  Playlist.swift
//  MusicRoom
//
//  Created by Etienne TRANCHIER on 11/5/18.
//  Copyright © 2018 Etienne Tranchier. All rights reserved.
//

import Foundation

struct Creator: Codable {
    var id: Int?
    var name: String
}

struct Playlist: Codable {
    var creator: Creator?
    var tracks: PlaylistTrackData?
    var title: String
    var picture_medium: String?
    var _id : String?
    var id: Int?
}


struct SPlaylist : Codable {
    var id : Int
    var title : String
}

struct SearchPlaylist : Codable{
    let data : [SPlaylist]
}

struct AllPlaylist: Codable {
    var myPlaylists: [Playlist]?
    var friendPlaylists: [Playlist]?
    var allPlaylists: [Playlist]?
}
