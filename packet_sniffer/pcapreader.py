from scapy.all import *
import unirest
import json

def callbackFunction(response):
	pass
	# "http://54.68.246.202:3000/rssi"

def main():
    print "Reading pcap file %s"%sys.argv[1]
    myreader = PcapReader(sys.argv[1])
    packets = []
    routerId = sys.argv[2]
    for pkt in myreader:
		try:
		    extra = pkt.notdecoded
		except:
		    extra = None
		if extra!=None:
			signal_strength = (256-ord(extra[14:15]))
			signal_strength = signal_strength - 256 if signal_strength > 127 else signal_strength
			signal_strength = -signal_strength
			try:
				print "[%d] MAC: %s RSSi: %d"%(pkt.time, pkt.addr1, signal_strength)
				packets.append({'created': pkt.time * 1000, 'mac': pkt.addr1, 'rssi': signal_strength, 'router': routerId, 'processed': False})
				if len(packets) > 1000:
					thread = unirest.post("http://54.68.246.202:3000/rssi", headers = {"Content-Type": "application/json"}, params = json.dumps(packets), callback = callbackFunction)
					packets = []
			except:
				print "Caught exception"

if __name__=="__main__":
    main()
