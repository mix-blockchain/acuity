import TitleMixinProto from './protobuf/TitleMixin_pb.js'
import ImageMixinProto from './protobuf/ImageMixin_pb.js'
import BodyTextMixinProto from './protobuf/BodyTextMixin_pb.js'
import MixinSchemaMixinProto from './protobuf/MixinSchemaMixin_pb.js'
import ProfileMixinProto from './protobuf/ProfileMixin_pb.js'
import FileMixinProto from './protobuf/FileMixin_pb.js'
import VideoMixinProto from './protobuf/VideoMixin_pb.js'
import MixContent from './MixContent'
import bs58 from 'bs58'

export default class MixRevision {
  vue: any
  item: any
  revisionId: number
  content: MixContent

  constructor(vue, item, revisionId) {
    this.vue = vue
    this.item = item
    this.revisionId = revisionId
  }

  async load() {
    this.content = new MixContent(this.vue)
    await this.content.load(this.item.item.ipfsHashes[this.revisionId])
    return this
  }

  getTimestamp() {
    return this.item.item.timestamps[this.revisionId]
  }

  getTitle() {
    return TitleMixinProto.TitleMixin.deserializeBinary(this.content.getPayloads('0x344f4812')[0]).getTitle()
  }

  async getImageUrl(widthMin, heightMin) {
    let imageMessage = new ImageMixinProto.ImageMixin.deserializeBinary(this.content.getPayloads('0x045eee8c')[0])
    let width = imageMessage.getWidth()
    let height = imageMessage.getHeight()
    let mipmapList = imageMessage.getMipmapLevelList()

    let i, scale
    for (i = 0; i < mipmapList.length; i++) {
      scale = 2 ** i
      if (width / scale < widthMin * 4 || height / scale < heightMin * 4) {
        break
      }
    }

    let response = await this.vue.$ipfsClient.get(bs58.encode(Buffer.from(mipmapList[i].getIpfsHash())))

    return 'data:image/png;base64, ' + response.toString('base64')
  }

  getImage(widthMin, heightMin) {
    let imageMessage = new ImageMixinProto.ImageMixin.deserializeBinary(this.content.getPayloads('0x045eee8c')[0])
    let width = imageMessage.getWidth()
    let height = imageMessage.getHeight()
    let mipmapList = imageMessage.getMipmapLevelList()

    if (mipmapList.length == 0) {
      return ''
    }

    let i, scale
    for (i = 0; i < mipmapList.length; i++) {
      scale = 2 ** i
      if (width / scale < widthMin * 4 || height / scale < heightMin * 4) {
        break
      }
    }

    return bs58.encode(Buffer.from(mipmapList[i].getIpfsHash()))
  }

  getFile() {
    let fileMessage = FileMixinProto.FileMixin.deserializeBinary(this.content.getPayloads('0x3c5bba9c')[0])
    return {
      name: fileMessage.getFilename(),
      size: fileMessage.getFilesize(),
      hash: bs58.encode(Buffer.from(fileMessage.getIpfsHash())),
    }
  }

  getVideo() {
    let videoMessage = VideoMixinProto.VideoMixin.deserializeBinary(this.content.getPayloads('0x045eee8d')[0])
    return videoMessage.toObject()
  }

  getBodyText() {
    return BodyTextMixinProto.BodyTextMixin.deserializeBinary(this.content.getPayloads('0x2d382044')[0]).getBodyText()
  }

  getMixinSchema() {
    return MixinSchemaMixinProto.MixinSchemaMixin.deserializeBinary(this.content.getPayloads('0xcdce4e5d')[0]).getMixinSchema()
  }

  getProfile() {
    let profileMessage = ProfileMixinProto.ProfileMixin.deserializeBinary(this.content.getPayloads('0xbeef2144')[0])
    return {
      type: profileMessage.getType(),
      location: profileMessage.getLocation(),
    }
  }

}
